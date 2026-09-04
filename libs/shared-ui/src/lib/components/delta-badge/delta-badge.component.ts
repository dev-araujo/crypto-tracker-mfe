import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatPercent } from '@crypto/shared-utils';
import { IconComponent } from '../icon/icon.component';

type DeltaTrend = 'up' | 'down' | 'flat';

@Component({
  selector: 'crypto-delta-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './delta-badge.component.html',
  styleUrl: './delta-badge.component.scss',
  host: {
    '[class]': '"delta delta--" + trend() + " delta--" + size()',
    '[attr.title]': 'description()',
  },
})
export class DeltaBadgeComponent {
  readonly value = input.required<number | null>();
  readonly size = input<'sm' | 'md'>('sm');
  readonly period = input<string>('');

  protected readonly trend = computed<DeltaTrend>(() => {
    const value = this.value();

    if (value === null || value === 0) {
      return 'flat';
    }

    return value > 0 ? 'up' : 'down';
  });

  protected readonly iconName = computed(() => {
    const trend = this.trend();

    if (trend === 'flat') {
      return 'minus';
    }

    return trend === 'up' ? 'arrow-up' : 'arrow-down';
  });

  protected readonly label = computed(() => formatPercent(this.value()));

  protected readonly description = computed(() => {
    const period = this.period();

    return period.length > 0 ? `Variação em ${period}` : 'Variação de preço';
  });
}
