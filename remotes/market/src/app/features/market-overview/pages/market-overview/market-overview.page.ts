import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Coin,
  CoinOrderBy,
  TimePeriodCode,
  findTimePeriodByCode,
} from '@crypto/shared-data-access';
import { MarketSearchStore, NotificationStore, WatchlistStore } from '@crypto/shared-state';
import { IconComponent } from '@crypto/shared-ui';
import { formatInteger } from '@crypto/shared-utils';
import {
  mapFiltersToRouteParams,
  mapRouteParamsToFilters,
} from '../../mappers/market-filters.mapper';
import { MarketFilters } from '../../models/market-filters.model';
import { MarketService } from '../../services/market.service';
import { CoinTableComponent } from './components/coin-table/coin-table.component';
import { MarketStatsComponent } from './components/market-stats/market-stats.component';
import { MarketToolbarComponent } from './components/market-toolbar/market-toolbar.component';

@Component({
  selector: 'market-overview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CoinTableComponent, MarketStatsComponent, MarketToolbarComponent, IconComponent],
  templateUrl: './market-overview.page.html',
  styleUrl: './market-overview.page.scss',
})
export class MarketOverviewPage {
  readonly search = input<string>();
  readonly offset = input<string>();
  readonly limit = input<string>();
  readonly orderBy = input<string>();
  readonly direction = input<string>();
  readonly period = input<string>();

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(MarketService);
  private readonly searchStore = inject(MarketSearchStore);
  private readonly watchlist = inject(WatchlistStore);
  private readonly notifications = inject(NotificationStore);

  protected readonly coins = this.service.coins;
  protected readonly stats = this.service.stats;
  protected readonly status = this.service.status;
  protected readonly filters = this.service.filters;
  protected readonly updatedAt = this.service.updatedAt;
  protected readonly currencyCode = this.service.currencyCode;
  protected readonly totalResults = this.service.totalResults;
  protected readonly watchedUuids = this.watchlist.uuids;

  protected readonly periodLabel = computed(
    () => findTimePeriodByCode(this.filters().timePeriod).label,
  );

  protected readonly resultSummary = computed(() => {
    const total = this.totalResults();

    return total === 1 ? '1 ativo listado' : `${formatInteger(total)} ativos listados`;
  });

  constructor() {
    effect(() => this.synchronizeFiltersFromRoute());
  }

  protected onSortChange(orderBy: CoinOrderBy): void {
    this.navigateWith(this.service.changeSort(orderBy));
  }

  protected onPeriodChange(period: TimePeriodCode): void {
    this.navigateWith(this.service.changePeriod(period));
  }

  protected onOffsetChange(offset: number): void {
    this.navigateWith(this.service.changeOffset(offset));
  }

  protected onLimitChange(limit: number): void {
    this.navigateWith(this.service.changeLimit(limit));
  }

  protected onSearchCleared(): void {
    this.searchStore.clear();
    this.navigateWith({ ...this.filters(), search: '', offset: 0 });
  }

  protected onWatchToggled(coin: Coin): void {
    const wasAdded = this.watchlist.toggle(coin.uuid);

    this.notifications.notifyInfo(
      wasAdded ? `${coin.name} adicionada à watchlist.` : `${coin.name} removida da watchlist.`,
    );
  }

  protected onRefresh(): void {
    this.service.refresh();
  }

  private synchronizeFiltersFromRoute(): void {
    const filters = mapRouteParamsToFilters({
      search: this.search(),
      offset: this.offset(),
      limit: this.limit(),
      orderBy: this.orderBy(),
      direction: this.direction(),
      period: this.period(),
    });

    this.service.applyFilters(filters);
    this.searchStore.setTerm(filters.search);
  }

  private navigateWith(filters: MarketFilters): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: mapFiltersToRouteParams(filters),
      queryParamsHandling: 'merge',
    });
  }
}
