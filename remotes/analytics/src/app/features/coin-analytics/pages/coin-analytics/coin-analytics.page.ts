import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  DEFAULT_TIME_PERIOD,
  TIME_PERIODS,
  TimePeriodCode,
  findTimePeriodByCode,
  isTimePeriodCode,
} from '@crypto/shared-data-access';
import { NotificationStore, WatchlistStore } from '@crypto/shared-state';
import {
  EmptyStateComponent,
  IconComponent,
  PriceChartComponent,
  SegmentOption,
  SegmentedControlComponent,
  SkeletonComponent,
} from '@crypto/shared-ui';
import { formatCurrency } from '@crypto/shared-utils';
import { mapHistoryToSeries } from '../../mappers/chart-series.mapper';
import { CoinAnalyticsService } from '../../services/coin-analytics.service';
import { CoinAboutComponent } from './components/coin-about/coin-about.component';
import { CoinLinksComponent } from './components/coin-links/coin-links.component';
import { CoinMetricsComponent } from './components/coin-metrics/coin-metrics.component';
import { CoinSummaryComponent } from './components/coin-summary/coin-summary.component';

@Component({
  selector: 'analytics-coin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CoinAnalyticsService],
  imports: [
    RouterLink,
    CoinAboutComponent,
    CoinLinksComponent,
    CoinMetricsComponent,
    CoinSummaryComponent,
    EmptyStateComponent,
    IconComponent,
    PriceChartComponent,
    SegmentedControlComponent,
    SkeletonComponent,
  ],
  templateUrl: './coin-analytics.page.html',
  styleUrl: './coin-analytics.page.scss',
})
export class CoinAnalyticsPage {
  readonly uuid = input.required<string>();
  readonly period = input<string>();

  private readonly service = inject(CoinAnalyticsService);
  private readonly watchlist = inject(WatchlistStore);
  private readonly notifications = inject(NotificationStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly detail = this.service.detail;
  protected readonly detailStatus = this.service.detailStatus;
  protected readonly historyStatus = this.service.historyStatus;
  protected readonly currencyCode = this.service.currencyCode;

  protected readonly periodOptions: readonly SegmentOption<TimePeriodCode>[] = TIME_PERIODS.map(
    (timePeriod) => ({
      value: timePeriod.code,
      label: timePeriod.label,
      description: timePeriod.description,
    }),
  );

  protected readonly selectedPeriod = computed<TimePeriodCode>(() => {
    const period = this.period();

    return period !== undefined && isTimePeriodCode(period) ? period : DEFAULT_TIME_PERIOD.code;
  });

  protected readonly periodLabel = computed(
    () => findTimePeriodByCode(this.selectedPeriod()).label,
  );

  protected readonly series = computed(() => mapHistoryToSeries(this.service.history()));

  protected readonly isWatched = computed(() => this.watchlist.uuids().includes(this.uuid()));

  protected readonly isChartLoading = computed(
    () => this.historyStatus() === 'loading' || this.series().length === 0,
  );

  protected readonly hasChartFailed = computed(() => this.historyStatus() === 'error');

  protected readonly rangeLabels = computed(() => {
    const history = this.service.history();
    const currency = this.currencyCode();

    if (history === null) {
      return null;
    }

    return {
      lowest: formatCurrency(history.lowest, currency),
      highest: formatCurrency(history.highest, currency),
      trend: history.trend,
    };
  });

  constructor() {
    effect(() => this.service.selectCoin(this.uuid()));
    effect(() => this.service.selectPeriod(this.selectedPeriod()));
  }

  protected onPeriodChange(period: TimePeriodCode): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { period: period === DEFAULT_TIME_PERIOD.code ? null : period },
      queryParamsHandling: 'merge',
    });
  }

  protected onWatchToggled(): void {
    const detail = this.detail();

    if (detail === null) {
      return;
    }

    const wasAdded = this.watchlist.toggle(detail.uuid);

    this.notifications.notifyInfo(
      wasAdded ? `${detail.name} adicionada à watchlist.` : `${detail.name} removida da watchlist.`,
    );
  }

  protected onRetry(): void {
    this.service.reload();
  }
}
