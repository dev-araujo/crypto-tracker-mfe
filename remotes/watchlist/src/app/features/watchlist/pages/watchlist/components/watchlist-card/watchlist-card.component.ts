import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Coin } from '@crypto/shared-data-access';
import {
  CoinIdentityComponent,
  CompactNumberPipe,
  DeltaBadgeComponent,
  IconComponent,
  PricePipe,
  SparklineComponent,
} from '@crypto/shared-ui';

@Component({
  selector: 'watchlist-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    CoinIdentityComponent,
    CompactNumberPipe,
    DeltaBadgeComponent,
    IconComponent,
    PricePipe,
    SparklineComponent,
  ],
  templateUrl: './watchlist-card.component.html',
  styleUrl: './watchlist-card.component.scss',
})
export class WatchlistCardComponent {
  readonly coin = input.required<Coin>();
  readonly currencyCode = input.required<string>();
  readonly periodLabel = input.required<string>();
  readonly removed = output<Coin>();
}
