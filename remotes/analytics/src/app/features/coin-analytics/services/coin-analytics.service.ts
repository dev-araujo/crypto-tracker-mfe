import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  CachePolicy,
  CoinApiService,
  CoinDetail,
  CoinDetailQuery,
  DEFAULT_TIME_PERIOD,
  PriceHistory,
  TimePeriodCode,
  toCoinDetail,
  toPriceHistory,
} from '@crypto/shared-data-access';
import { NotificationStore, PreferencesStore } from '@crypto/shared-state';
import { Observable, Subject, catchError, filter, map, merge, of, switchMap, tap } from 'rxjs';
import { AnalyticsStatus } from '../models/analytics-status.model';

interface AnalyticsRequest {
  readonly query: CoinDetailQuery;
  readonly policy: CachePolicy;
}

@Injectable()
export class CoinAnalyticsService {
  private readonly api = inject(CoinApiService);
  private readonly preferences = inject(PreferencesStore);
  private readonly notifications = inject(NotificationStore);

  private readonly _uuid = signal<string | null>(null);
  private readonly _timePeriod = signal<TimePeriodCode>(DEFAULT_TIME_PERIOD.code);
  private readonly _detail = signal<CoinDetail | null>(null);
  private readonly _history = signal<PriceHistory | null>(null);
  private readonly _detailStatus = signal<AnalyticsStatus>('idle');
  private readonly _historyStatus = signal<AnalyticsStatus>('idle');
  private readonly reloadTrigger = new Subject<void>();

  readonly detail = this._detail.asReadonly();
  readonly history = this._history.asReadonly();
  readonly detailStatus = this._detailStatus.asReadonly();
  readonly historyStatus = this._historyStatus.asReadonly();
  readonly timePeriod = this._timePeriod.asReadonly();
  readonly currencyCode = this.preferences.currencyCode;

  readonly isLoadingDetail = computed(() => this._detailStatus() === 'loading');
  readonly hasDetailFailed = computed(() => this._detailStatus() === 'error');

  private readonly query = computed<CoinDetailQuery | null>(() => {
    const uuid = this._uuid();

    if (uuid === null) {
      return null;
    }

    return {
      uuid,
      currencyUuid: this.preferences.currencyUuid(),
      timePeriod: this._timePeriod(),
    };
  });

  constructor() {
    this.watchDetail();
    this.watchHistory();
  }

  selectCoin(uuid: string): void {
    if (uuid !== this._uuid()) {
      this._detail.set(null);
      this._history.set(null);
    }

    this._uuid.set(uuid);
  }

  selectPeriod(timePeriod: TimePeriodCode): void {
    this._timePeriod.set(timePeriod);
  }

  reload(): void {
    this.reloadTrigger.next();
  }

  private watchDetail(): void {
    this.definedQuery()
      .pipe(
        tap(() => this._detailStatus.set(this._detail() === null ? 'loading' : 'refreshing')),
        switchMap((request) => this.fetchDetail(request)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  private watchHistory(): void {
    this.definedQuery()
      .pipe(
        tap(() => this._historyStatus.set(this._history() === null ? 'loading' : 'refreshing')),
        switchMap((request) => this.fetchHistory(request)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  private definedQuery(): Observable<AnalyticsRequest> {
    return merge(
      toObservable(this.query).pipe(map((query) => this.toRequest(query, 'prefer-cache'))),
      this.reloadTrigger.pipe(map(() => this.toRequest(this.query(), 'revalidate'))),
    ).pipe(filter((request): request is AnalyticsRequest => request !== null));
  }

  private toRequest(query: CoinDetailQuery | null, policy: CachePolicy): AnalyticsRequest | null {
    return query === null ? null : { query, policy };
  }

  private fetchDetail(request: AnalyticsRequest): Observable<CoinDetail | null> {
    return this.api.getCoin(request.query, request.policy).pipe(
      map((response) => toCoinDetail(response.data.coin)),
      tap((detail) => {
        this._detail.set(detail);
        this._detailStatus.set('ready');
      }),
      catchError((error: HttpErrorResponse) => {
        this._detailStatus.set('error');
        this.notifications.notifyError(this.resolveMessage(error, 'os detalhes do ativo'));

        return of(null);
      }),
    );
  }

  private fetchHistory(request: AnalyticsRequest): Observable<PriceHistory | null> {
    return this.api.getCoinHistory(request.query, request.policy).pipe(
      map(toPriceHistory),
      tap((history) => {
        this._history.set(history);
        this._historyStatus.set('ready');
      }),
      catchError((error: HttpErrorResponse) => {
        this._historyStatus.set('error');
        this.notifications.notifyError(this.resolveMessage(error, 'o histórico de preços'));

        return of(null);
      }),
    );
  }

  private resolveMessage(error: HttpErrorResponse, subject: string): string {
    if (error.status === 0) {
      return `Sem conexão para carregar ${subject}.`;
    }

    if (error.status === 404) {
      return 'Ativo não encontrado na base da Coinranking.';
    }

    return `Não foi possível carregar ${subject} agora.`;
  }
}
