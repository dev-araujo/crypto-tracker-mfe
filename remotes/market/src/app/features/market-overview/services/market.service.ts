import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CachePolicy,
  Coin,
  CoinApiService,
  CoinOrderBy,
  CoinPage,
  CoinQuery,
  MarketStats,
  RevalidationScheduler,
  TimePeriodCode,
  toCoinPage,
} from '@crypto/shared-data-access';
import { NotificationStore, PreferencesStore } from '@crypto/shared-state';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  finalize,
  map,
  merge,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { DEFAULT_MARKET_FILTERS } from '../constants/market.constant';
import { MarketFilters, MarketStatus } from '../models/market-filters.model';

type LoadMode = 'query' | 'manual' | 'auto';

@Injectable()
export class MarketService {
  private readonly api = inject(CoinApiService);
  private readonly preferences = inject(PreferencesStore);
  private readonly notifications = inject(NotificationStore);
  private readonly revalidation = inject(RevalidationScheduler);

  private readonly _filters = signal<MarketFilters>(DEFAULT_MARKET_FILTERS);
  private readonly _coins = signal<readonly Coin[]>([]);
  private readonly _stats = signal<MarketStats | null>(null);
  private readonly _status = signal<MarketStatus>('loading');
  private readonly _updatedAt = signal<Date | null>(null);
  private readonly manualRefresh = new Subject<void>();
  private readonly loadSettled = new Subject<void>();

  readonly filters = this._filters.asReadonly();
  readonly coins = this._coins.asReadonly();
  readonly stats = this._stats.asReadonly();
  readonly status = this._status.asReadonly();
  readonly updatedAt = this._updatedAt.asReadonly();

  readonly currencyCode = this.preferences.currencyCode;
  readonly totalResults = computed(() => this._stats()?.matchingCoins ?? 0);
  readonly isBusy = computed(() => this._status() === 'loading');
  readonly hasFailed = computed(() => this._status() === 'error');
  readonly isEmpty = computed(() => this._status() === 'ready' && this._coins().length === 0);

  private readonly query = computed<CoinQuery>(() => ({
    ...this._filters(),
    currencyUuid: this.preferences.currencyUuid(),
  }));

  constructor() {
    this.watchQueryChanges();
  }

  applyFilters(filters: MarketFilters): void {
    this._filters.set(filters);
  }

  refresh(): void {
    this.manualRefresh.next();
  }

  changeSort(orderBy: CoinOrderBy): MarketFilters {
    const current = this._filters();
    const isSameColumn = current.orderBy === orderBy;

    return {
      ...current,
      orderBy,
      orderDirection: isSameColumn && current.orderDirection === 'desc' ? 'asc' : 'desc',
      offset: 0,
    };
  }

  changePeriod(timePeriod: TimePeriodCode): MarketFilters {
    return { ...this._filters(), timePeriod };
  }

  changeOffset(offset: number): MarketFilters {
    return { ...this._filters(), offset };
  }

  changeLimit(limit: number): MarketFilters {
    return { ...this._filters(), limit, offset: 0 };
  }

  private watchQueryChanges(): void {
    merge(
      toObservable(this.query).pipe(map((): LoadMode => 'query')),
      this.manualRefresh.pipe(map((): LoadMode => 'manual')),
      this.scheduledRevalidations(),
    )
      .pipe(
        tap((mode) => this.markLoading(mode)),
        switchMap((mode) => this.fetchPage(mode)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  private scheduledRevalidations(): Observable<LoadMode> {
    return this.loadSettled.pipe(
      startWith(undefined),
      switchMap(() => this.revalidation.nextTick()),
      map((): LoadMode => 'auto'),
    );
  }

  private fetchPage(mode: LoadMode): Observable<CoinPage | null> {
    return this.api.listCoins(this.query(), this.cachePolicyFor(mode)).pipe(
      map(toCoinPage),
      tap((page) => this.applyPage(page)),
      catchError((error: HttpErrorResponse) => this.handleFailure(error, mode)),
      finalize(() => this.loadSettled.next()),
    );
  }

  private cachePolicyFor(mode: LoadMode): CachePolicy {
    return mode === 'query' ? 'prefer-cache' : 'revalidate';
  }

  private markLoading(mode: LoadMode): void {
    this._status.set(mode === 'query' ? 'loading' : 'refreshing');
  }

  private applyPage(page: CoinPage): void {
    this._coins.set(page.coins);
    this._stats.set(page.stats);
    this._status.set('ready');
    this._updatedAt.set(new Date());
  }

  private handleFailure(error: HttpErrorResponse, mode: LoadMode): Observable<null> {
    if (mode === 'auto') {
      this._status.set('ready');

      return EMPTY;
    }

    this._status.set('error');
    this.notifications.notifyError(this.resolveMessage(error));

    return of(null);
  }

  private resolveMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Sem conexão com o serviço de cotações. Verifique sua rede.';
    }

    if (error.status === 401 || error.status === 403) {
      return 'Credencial da API de cotações inválida ou expirada.';
    }

    return 'Não foi possível carregar as cotações agora. Tente novamente.';
  }
}
