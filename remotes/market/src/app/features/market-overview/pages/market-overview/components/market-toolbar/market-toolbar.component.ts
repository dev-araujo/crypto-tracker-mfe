import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TIME_PERIODS, TimePeriodCode } from '@crypto/shared-data-access';
import { SegmentOption, SegmentedControlComponent, IconComponent } from '@crypto/shared-ui';
import { formatElapsedSeconds } from '@crypto/shared-utils';
import { interval, map, startWith } from 'rxjs';
import { MarketStatus } from '../../../../models/market-filters.model';

const CLOCK_INTERVAL = 5_000;

@Component({
  selector: 'market-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SegmentedControlComponent, IconComponent],
  templateUrl: './market-toolbar.component.html',
  styleUrl: './market-toolbar.component.scss',
})
export class MarketToolbarComponent {
  readonly period = input.required<TimePeriodCode>();
  readonly status = input.required<MarketStatus>();
  readonly updatedAt = input.required<Date | null>();
  readonly periodChange = output<TimePeriodCode>();
  readonly refreshRequested = output<void>();

  protected readonly periodOptions: readonly SegmentOption<TimePeriodCode>[] = TIME_PERIODS.map(
    (timePeriod) => ({
      value: timePeriod.code,
      label: timePeriod.label,
      description: timePeriod.description,
    }),
  );

  private readonly clock = toSignal(
    interval(CLOCK_INTERVAL).pipe(
      map(() => Date.now()),
      startWith(Date.now()),
    ),
    { initialValue: Date.now() },
  );

  protected readonly isRefreshing = computed(() => this.status() === 'refreshing');

  protected readonly updatedLabel = computed(() => {
    const updatedAt = this.updatedAt();

    if (updatedAt === null) {
      return 'Sincronizando…';
    }

    const elapsedSeconds = Math.floor((this.clock() - updatedAt.getTime()) / 1000);

    return `Atualizado ${formatElapsedSeconds(elapsedSeconds)}`;
  });

  protected onPeriodChange(period: TimePeriodCode): void {
    this.periodChange.emit(period);
  }
}
