import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CoinDetail } from '@crypto/shared-data-access';
import {
  CoinIdentityComponent,
  DeltaBadgeComponent,
  IconComponent,
  PricePipe,
  WatchToggleComponent,
} from '@crypto/shared-ui';

@Component({
  selector: 'analytics-coin-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CoinIdentityComponent,
    DeltaBadgeComponent,
    IconComponent,
    PricePipe,
    WatchToggleComponent,
  ],
  templateUrl: './coin-summary.component.html',
  styleUrl: './coin-summary.component.scss',
})
export class CoinSummaryComponent {
  readonly coin = input.required<CoinDetail>();
  readonly currencyCode = input.required<string>();
  readonly periodLabel = input.required<string>();
  readonly isWatched = input.required<boolean>();
  readonly watchToggled = output<void>();
}
