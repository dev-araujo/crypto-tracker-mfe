import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  CachePolicy,
  Coin,
  CoinApiService,
  DEFAULT_TIME_PERIOD,
  RevalidationScheduler,
  TimePeriodCode,
  toCoin,
} from '@crypto/shared-data-access';
import { NotificationStore, PreferencesStore, WatchlistStore } from '@crypto/shared-state';
import {
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
import { WatchlistStatus } from '../models/watchlist-status.model';

interface WatchlistQuery {
  readonly uuids: readonly string[];
  readonly currencyUuid: string;
  readonly timePeriod: TimePeriodCode;
}

@Injectable()
export class WatchlistCoinsService {
  private readonly api = inject(CoinApiService);
  private readonly watchlist = inject(WatchlistStore);
  private readonly preferences = inject(PreferencesStore);
  private readonly notifications = inject(NotificationStore);
  private readonly revalidation = inject(RevalidationScheduler);

  private readonly _timePeriod = signal<TimePeriodCode>(DEFAULT_TIME_PERIOD.code);
  private readonly _coins = signal<readonly Coin[]>([]);
  private readonly _status = signal<WatchlistStatus>('loading');
  private readonly manualRefresh = new Subject<void>();
  private readonly loadSettled = new Subject<void>();

  readonly coins = this._coins.asReadonly();
  readonly status = this._status.asReadonly();
  readonly timePeriod = this._timePeriod.asReadonly();
  readonly currencyCode = this.preferences.currencyCode;
  readonly trackedCount = this.watchlist.count;

  readonly isLoading = computed(() => this._status() === 'loading');
  readonly hasFailed = computed(() => this._status() === 'error');
  readonly isEmpty = computed(() => this.watchlist.isEmpty());

  readonly bestPerformer = computed(() => this.rankByChange('best'));
  readonly worstPerformer = computed(() => this.rankByChange('worst'));

  readonly averageChange = computed(() => {
    const changes = this._coins()
      .map((coin) => coin.changePercent)
      .filter((change): change is number => change !== null);

    if (changes.length === 0) {
      return null;
    }

    return changes.reduce((total, change) => total + change, 0) / changes.length;
  });

  private readonly query = computed<WatchlistQuery>(() => ({
    uuids: this.watchlist.uuids(),
    currencyUuid: this.preferences.currencyUuid(),
    timePeriod: this._timePeriod(),
  }));

  constructor() {
    this.watchQueryChanges();
  }

  selectPeriod(timePeriod: TimePeriodCode): void {
    this._timePeriod.set(timePeriod);
  }

  refresh(): void {
    this.manualRefresh.next();
  }

  removeCoin(coin: Coin): void {
    this.watchlist.remove(coin.uuid);
    this.notifications.notifyInfo(`${coin.name} removida da watchlist.`);
  }

  clearAll(): void {
    const removedCount = this.watchlist.count();

    this.watchlist.clear();
    this.notifications.notifyInfo(
      removedCount === 1 ? '1 ativo removido da watchlist.' : `${removedCount} ativos removidos.`,
    );
  }

  private watchQueryChanges(): void {
    merge(
      toObservable(this.query).pipe(map(() => false)),
      this.manualRefresh.pipe(map(() => true)),
      this.scheduledRevalidations(),
    )
      .pipe(
        tap((isSilent) => this._status.set(isSilent ? 'refreshing' : 'loading')),
        switchMap((isSilent) => this.fetchCoins(isSilent)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  private scheduledRevalidations(): Observable<boolean> {
    return this.loadSettled.pipe(
      startWith(undefined),
      switchMap(() => this.revalidation.nextTick()),
      map(() => true),
    );
  }

  private fetchCoins(isSilent: boolean): Observable<readonly Coin[] | null> {
    const query = this.query();

    if (query.uuids.length === 0) {
      this._coins.set([]);
      this._status.set('ready');

      return of([]);
    }

    return this.api
      .listCoinsByUuids(
        query.uuids,
        query.currencyUuid,
        query.timePeriod,
        this.cachePolicyFor(isSilent),
      )
      .pipe(
        map((response) => response.data.coins.map(toCoin)),
        tap((coins) => {
          this._coins.set(this.sortByWatchlistOrder(coins, query.uuids));
          this._status.set('ready');
        }),
        catchError((error: HttpErrorResponse) => this.handleFailure(error, isSilent)),
        finalize(() => this.loadSettled.next()),
      );
  }

  private cachePolicyFor(isSilent: boolean): CachePolicy {
    return isSilent ? 'revalidate' : 'prefer-cache';
  }

  private sortByWatchlistOrder(coins: readonly Coin[], uuids: readonly string[]): readonly Coin[] {
    return [...coins].sort(
      (first, second) => uuids.indexOf(first.uuid) - uuids.indexOf(second.uuid),
    );
  }

  private handleFailure(error: HttpErrorResponse, isSilent: boolean): Observable<null> {
    if (isSilent) {
      this._status.set('ready');

      return of(null);
    }

    this._status.set('error');
    this.notifications.notifyError(
      error.status === 0
        ? 'Sem conexão para atualizar sua watchlist.'
        : 'Não foi possível carregar sua watchlist agora.',
    );

    return of(null);
  }

  private rankByChange(mode: 'best' | 'worst'): Coin | null {
    const ranked = [...this._coins()]
      .filter((coin) => coin.changePercent !== null)
      .sort((first, second) => (second.changePercent ?? 0) - (first.changePercent ?? 0));

    if (ranked.length === 0) {
      return null;
    }

    return mode === 'best' ? ranked[0] : ranked[ranked.length - 1];
  }
}
