import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CoinDetail } from '@crypto/shared-data-access';
import { ProgressBarComponent, StatTileComponent } from '@crypto/shared-ui';
import {
  formatCompactCurrency,
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatInteger,
} from '@crypto/shared-utils';

@Component({
  selector: 'analytics-coin-metrics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressBarComponent, StatTileComponent],
  templateUrl: './coin-metrics.component.html',
  styleUrl: './coin-metrics.component.scss',
})
export class CoinMetricsComponent {
  readonly coin = input.required<CoinDetail>();
  readonly currencyCode = input.required<string>();

  protected readonly metrics = computed(() => {
    const coin = this.coin();
    const currency = this.currencyCode();

    return [
      {
        label: 'Cap. de mercado',
        value: formatCompactCurrency(coin.marketCap, currency),
        hint: `Posição #${coin.rank}`,
      },
      {
        label: 'Volume 24h',
        value: formatCompactCurrency(coin.volume24h, currency),
        hint: 'Negociado nas últimas 24h',
      },
      {
        label: 'Cap. totalmente diluída',
        value: formatCompactCurrency(coin.fullyDilutedMarketCap, currency),
        hint: 'Considerando oferta máxima',
      },
      {
        label: 'Máxima histórica',
        value: formatCurrency(coin.allTimeHighPrice, currency),
        hint: coin.allTimeHighAt === null ? '' : `Em ${formatDate(coin.allTimeHighAt)}`,
      },
      {
        label: 'Mercados',
        value: formatInteger(coin.numberOfMarkets),
        hint: `${formatInteger(coin.numberOfExchanges)} exchanges`,
      },
      {
        label: 'Listada desde',
        value: formatDate(coin.listedAt),
        hint: 'Primeiro registro na Coinranking',
      },
    ];
  });

  protected readonly supply = computed(() => {
    const supply = this.coin().supply;

    return {
      circulating: formatCompactNumber(supply.circulating),
      total: formatCompactNumber(supply.total),
      max: formatCompactNumber(supply.max),
      ratio: supply.circulatingRatio,
      percentage:
        supply.circulatingRatio === null ? '—' : `${Math.round(supply.circulatingRatio * 100)}%`,
    };
  });
}
