import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MarketStats } from '@crypto/shared-data-access';
import { formatCompactCurrency, formatInteger } from '@crypto/shared-utils';
import { SkeletonComponent, StatTileComponent } from '@crypto/shared-ui';

@Component({
  selector: 'market-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonComponent, StatTileComponent],
  templateUrl: './market-stats.component.html',
  styleUrl: './market-stats.component.scss',
})
export class MarketStatsComponent {
  readonly stats = input.required<MarketStats | null>();
  readonly currencyCode = input.required<string>();

  protected readonly tiles = computed(() => {
    const stats = this.stats();

    if (stats === null) {
      return [];
    }

    return [
      {
        label: 'Volume 24h',
        value: formatCompactCurrency(stats.totalVolume24h, this.currencyCode()),
        hint: 'Negociado no período',
      },
      {
        label: 'Ativos rastreados',
        value: formatInteger(stats.totalCoins),
        hint: 'Na Coinranking',
      },
      { label: 'Exchanges', value: formatInteger(stats.totalExchanges), hint: 'Corretoras ativas' },
      { label: 'Mercados', value: formatInteger(stats.totalMarkets), hint: 'Pares negociados' },
    ];
  });

  protected readonly placeholders = Array.from({ length: 4 });
}
