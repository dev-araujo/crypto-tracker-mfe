import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Coin,
  TIME_PERIODS,
  TimePeriodCode,
  findTimePeriodByCode,
} from '@crypto/shared-data-access';
import {
  ConfirmDialogComponent,
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
    ConfirmDialogComponent,
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
  protected readonly isClearDialogOpen = signal(false);

  protected readonly clearDialogDescription = computed(() => {
    const total = this.service.trackedCount();

    return total === 1
      ? 'O ativo que você acompanha será removido deste navegador. Não é possível desfazer.'
      : `Os ${total} ativos que você acompanha serão removidos deste navegador. Não é possível desfazer.`;
  });

  protected onPeriodChange(period: TimePeriodCode): void {
    this.service.selectPeriod(period);
  }

  protected onRemove(coin: Coin): void {
    this.service.removeCoin(coin);
  }

  protected onClearAll(): void {
    this.isClearDialogOpen.set(true);
  }

  protected onClearConfirmed(): void {
    this.isClearDialogOpen.set(false);
    this.service.clearAll();
  }

  protected onClearDismissed(): void {
    this.isClearDialogOpen.set(false);
  }

  protected onRetry(): void {
    this.service.refresh();
  }
}
