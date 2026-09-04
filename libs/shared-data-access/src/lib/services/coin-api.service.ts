import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CachePolicy, withCachePolicy } from '../cache/cache-policy.context';
import { CRYPTO_API_CONFIG } from '../config/api-config.token';
import {
  CoinDetailApiResponse,
  CoinListApiResponse,
  PriceHistoryApiResponse,
} from '../models/coin-api.model';
import { CoinDetailQuery, CoinQuery } from '../models/coin-query.model';
import { TimePeriodCode } from '../models/time-period.model';

@Injectable()
export class CoinApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(CRYPTO_API_CONFIG);

  listCoins(
    query: CoinQuery,
    policy: CachePolicy = 'prefer-cache',
  ): Observable<CoinListApiResponse> {
    let params = new HttpParams()
      .set('referenceCurrencyUuid', query.currencyUuid)
      .set('limit', query.limit)
      .set('offset', query.offset)
      .set('orderBy', query.orderBy)
      .set('orderDirection', query.orderDirection)
      .set('timePeriod', query.timePeriod);

    if (query.search.length > 0) {
      params = params.set('search', query.search);
    }

    return this.http.get<CoinListApiResponse>(this.endpoint('coins'), {
      headers: this.headers(),
      context: withCachePolicy(policy),
      params,
    });
  }

  listCoinsByUuids(
    uuids: readonly string[],
    currencyUuid: string,
    timePeriod: TimePeriodCode,
    policy: CachePolicy = 'prefer-cache',
  ): Observable<CoinListApiResponse> {
    const params = uuids.reduce(
      (accumulated, uuid) => accumulated.append('uuids[]', uuid),
      new HttpParams()
        .set('referenceCurrencyUuid', currencyUuid)
        .set('timePeriod', timePeriod)
        .set('limit', Math.max(uuids.length, 1)),
    );

    return this.http.get<CoinListApiResponse>(this.endpoint('coins'), {
      headers: this.headers(),
      context: withCachePolicy(policy),
      params,
    });
  }

  getCoin(
    query: CoinDetailQuery,
    policy: CachePolicy = 'prefer-cache',
  ): Observable<CoinDetailApiResponse> {
    const params = new HttpParams()
      .set('referenceCurrencyUuid', query.currencyUuid)
      .set('timePeriod', query.timePeriod);

    return this.http.get<CoinDetailApiResponse>(this.endpoint(`coin/${query.uuid}`), {
      headers: this.headers(),
      context: withCachePolicy(policy),
      params,
    });
  }

  getCoinHistory(
    query: CoinDetailQuery,
    policy: CachePolicy = 'prefer-cache',
  ): Observable<PriceHistoryApiResponse> {
    const params = new HttpParams()
      .set('referenceCurrencyUuid', query.currencyUuid)
      .set('timePeriod', query.timePeriod);

    return this.http.get<PriceHistoryApiResponse>(this.endpoint(`coin/${query.uuid}/history`), {
      headers: this.headers(),
      context: withCachePolicy(policy),
      params,
    });
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({ 'x-access-token': this.config.accessToken });
  }

  private endpoint(path: string): string {
    return `${this.config.baseUrl.replace(/\/+$/, '')}/${path}`;
  }
}
