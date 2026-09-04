import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Coin, CoinOrderBy, OrderDirection } from '@crypto/shared-data-access';
import {
  CoinIdentityComponent,
  CompactNumberPipe,
  DeltaBadgeComponent,
  EmptyStateComponent,
  IconComponent,
  PaginatorComponent,
  PricePipe,
  SkeletonComponent,
  SparklineComponent,
  WatchToggleComponent,
} from '@crypto/shared-ui';
import { MARKET_COLUMNS, MARKET_PAGE_SIZES } from '../../../../constants/market.constant';
import { MarketStatus } from '../../../../models/market-filters.model';

@Component({
  selector: 'market-coin-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    CoinIdentityComponent,
    CompactNumberPipe,
    DeltaBadgeComponent,
    EmptyStateComponent,
    IconComponent,
    PaginatorComponent,
    PricePipe,
    SkeletonComponent,
    SparklineComponent,
    WatchToggleComponent,
  ],
  templateUrl: './coin-table.component.html',
  styleUrl: './coin-table.component.scss',
})
export class CoinTableComponent {
  readonly coins = input.required<readonly Coin[]>();
  readonly currencyCode = input.required<string>();
  readonly status = input.required<MarketStatus>();
  readonly orderBy = input.required<CoinOrderBy>();
  readonly orderDirection = input.required<OrderDirection>();
  readonly periodLabel = input.required<string>();
  readonly watchedUuids = input.required<readonly string[]>();
  readonly searchTerm = input<string>('');
  readonly offset = input.required<number>();
  readonly limit = input.required<number>();
  readonly total = input.required<number>();

  readonly sortChange = output<CoinOrderBy>();
  readonly watchToggled = output<Coin>();
  readonly offsetChange = output<number>();
  readonly limitChange = output<number>();
  readonly searchCleared = output<void>();
  readonly retried = output<void>();

  protected readonly columns = MARKET_COLUMNS;
  protected readonly pageSizes = MARKET_PAGE_SIZES;
  protected readonly skeletonRows = computed(() => Array.from({ length: this.limit() }));
  protected readonly isLoading = computed(() => this.status() === 'loading');
  protected readonly hasFailed = computed(() => this.status() === 'error');
  protected readonly isEmpty = computed(
    () => this.status() !== 'loading' && this.coins().length === 0,
  );

  protected isWatched(uuid: string): boolean {
    return this.watchedUuids().includes(uuid);
  }

  protected sortIcon(column: CoinOrderBy | null): string {
    if (column === null || column !== this.orderBy()) {
      return 'minus';
    }

    return this.orderDirection() === 'desc' ? 'arrow-down' : 'arrow-up';
  }

  protected ariaSort(column: CoinOrderBy | null): string {
    if (column === null || column !== this.orderBy()) {
      return 'none';
    }

    return this.orderDirection() === 'desc' ? 'descending' : 'ascending';
  }
}
