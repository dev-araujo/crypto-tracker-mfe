import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Coin } from '@crypto/shared-data-access';
import { DeltaBadgeComponent, StatTileComponent } from '@crypto/shared-ui';
import { formatInteger } from '@crypto/shared-utils';

@Component({
  selector: 'watchlist-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DeltaBadgeComponent, StatTileComponent],
  templateUrl: './watchlist-summary.component.html',
  styleUrl: './watchlist-summary.component.scss',
})
export class WatchlistSummaryComponent {
  readonly total = input.required<number>();
  readonly averageChange = input.required<number | null>();
  readonly bestPerformer = input.required<Coin | null>();
  readonly worstPerformer = input.required<Coin | null>();
  readonly periodLabel = input.required<string>();
  readonly showPerformers = input<boolean>(true);

  protected readonly totalLabel = computed(() => formatInteger(this.total()));
}
