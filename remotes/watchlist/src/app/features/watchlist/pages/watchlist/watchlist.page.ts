import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Coin,
  TIME_PERIODS,
  TimePeriodCode,
  findTimePeriodByCode,
} from '@crypto/shared-data-access';
import {
  EmptyStateComponent,
  IconComponent,
  SegmentOption,
  SegmentedControlComponent,
  SkeletonComponent,
} from '@crypto/shared-ui';
import { WatchlistCoinsService } from '../../services/watchlist-coins.service';
import { WatchlistCardComponent } from './components/watchlist-card/watchlist-card.component';
import { WatchlistSummaryComponent } from './components/watchlist-summary/watchlist-summary.component';

@Component({
  selector: 'watchlist-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    EmptyStateComponent,
    IconComponent,
    SegmentedControlComponent,
    SkeletonComponent,
    WatchlistCardComponent,
    WatchlistSummaryComponent,
  ],
  templateUrl: './watchlist.page.html',
  styleUrl: './watchlist.page.scss',
})
export class WatchlistPage {
  private readonly service = inject(WatchlistCoinsService);

  protected readonly coins = this.service.coins;
  protected readonly status = this.service.status;
  protected readonly currencyCode = this.service.currencyCode;
  protected readonly isEmpty = this.service.isEmpty;
  protected readonly isLoading = this.service.isLoading;
  protected readonly hasFailed = this.service.hasFailed;
  protected readonly averageChange = this.service.averageChange;
  protected readonly bestPerformer = this.service.bestPerformer;
  protected readonly worstPerformer = this.service.worstPerformer;

  protected readonly periodOptions: readonly SegmentOption<TimePeriodCode>[] = TIME_PERIODS.map(
    (timePeriod) => ({
      value: timePeriod.code,
      label: timePeriod.label,
      description: timePeriod.description,
    }),
  );

  protected readonly selectedPeriod = this.service.timePeriod;
  protected readonly periodLabel = computed(
    () => findTimePeriodByCode(this.selectedPeriod()).label,
  );
  protected readonly skeletonCards = Array.from({ length: 3 });

  protected onPeriodChange(period: TimePeriodCode): void {
    this.service.selectPeriod(period);
  }

  protected onRemove(coin: Coin): void {
    this.service.removeCoin(coin);
  }

  protected onClearAll(): void {
    this.service.clearAll();
  }

  protected onRetry(): void {
    this.service.refresh();
  }
}
