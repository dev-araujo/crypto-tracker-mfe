import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { formatCompactCurrency, formatCurrency, formatDateTime } from '@crypto/shared-utils';
import {
  ChartPoint,
  PlottedPoint,
  buildAreaPath,
  buildLinePath,
  buildTicks,
  pickLabelIndexes,
  resolveBounds,
} from './chart-geometry.util';

const PADDING = { top: 18, right: 18, bottom: 30 } as const;
const LABEL_CHAR_WIDTH = 6.4;
const MIN_LABEL_GUTTER = 52;
const MAX_LABEL_GUTTER = 118;
const FALLBACK_WIDTH = 760;
const VALUE_TICKS = 5;
const LABEL_TICKS = 6;
const MINIMUM_POINTS = 2;

@Component({
  selector: 'crypto-price-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './price-chart.component.html',
  styleUrl: './price-chart.component.scss',
  host: { '[class]': '"chart chart--" + trend()' },
})
export class PriceChartComponent {
  readonly series = input.required<readonly ChartPoint[]>();
  readonly currencyCode = input.required<string>();
  readonly trend = input<'up' | 'down' | 'flat'>('flat');
  readonly height = input<number>(360);
  readonly ariaLabel = input<string>('Histórico de preço');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly surface = viewChild<ElementRef<SVGSVGElement>>('surface');
  protected readonly width = signal(FALLBACK_WIDTH);

  protected readonly activeIndex = signal<number | null>(null);
  protected readonly gradientId = `chart-gradient-${Math.random().toString(36).slice(2, 9)}`;

  protected readonly hasData = computed(() => this.series().length >= MINIMUM_POINTS);

  protected readonly plotted = computed<readonly PlottedPoint[]>(() => {
    const series = this.series();

    if (series.length < MINIMUM_POINTS) {
      return [];
    }

    const bounds = resolveBounds(series.map((point) => point.value));
    const range = bounds.highest - bounds.lowest || 1;
    const innerWidth = this.innerWidth();
    const innerHeight = this.innerHeight();
    const step = innerWidth / (series.length - 1);

    return series.map((point, index) => ({
      index,
      point,
      x: this.chartLeft() + step * index,
      y: PADDING.top + (1 - (point.value - bounds.lowest) / range) * innerHeight,
    }));
  });

  protected readonly linePath = computed(() => buildLinePath(this.plotted()));
  protected readonly areaPath = computed(() =>
    buildAreaPath(this.plotted(), this.height() - PADDING.bottom),
  );

  private readonly tickLabels = computed(() => {
    const bounds = resolveBounds(this.series().map((point) => point.value));

    return buildTicks(bounds, VALUE_TICKS).map((value) => ({
      value,
      label: formatCompactCurrency(value, this.currencyCode()),
    }));
  });

  protected readonly chartLeft = computed(() => {
    const longestLabel = this.tickLabels().reduce(
      (longest, tick) => Math.max(longest, tick.label.length),
      0,
    );

    return Math.min(
      Math.max(longestLabel * LABEL_CHAR_WIDTH + 20, MIN_LABEL_GUTTER),
      MAX_LABEL_GUTTER,
    );
  });

  protected readonly valueTicks = computed(() => {
    const bounds = resolveBounds(this.series().map((point) => point.value));
    const range = bounds.highest - bounds.lowest || 1;
    const innerHeight = this.innerHeight();

    return this.tickLabels().map((tick) => ({
      ...tick,
      y: PADDING.top + (1 - (tick.value - bounds.lowest) / range) * innerHeight,
    }));
  });

  protected readonly timeTicks = computed(() => {
    const plotted = this.plotted();
    const indexes = pickLabelIndexes(plotted.length, LABEL_TICKS);

    return indexes.map((pointIndex, tickIndex) => ({
      x: plotted[pointIndex].x,
      anchor: this.resolveAnchor(tickIndex, indexes.length),
      label: this.formatAxisLabel(plotted[pointIndex].point.timestamp),
    }));
  });

  protected readonly activePoint = computed(() => {
    const index = this.activeIndex();
    const plotted = this.plotted();

    if (index === null || index < 0 || index >= plotted.length) {
      return null;
    }

    return plotted[index];
  });

  protected readonly tooltip = computed(() => {
    const active = this.activePoint();

    if (active === null) {
      return null;
    }

    const isPastMiddle = active.x > this.width() / 2;

    return {
      x: active.x,
      y: active.y,
      alignEnd: isPastMiddle,
      price: formatCurrency(active.point.value, this.currencyCode()),
      moment: formatDateTime(new Date(active.point.timestamp)),
    };
  });

  protected readonly summary = computed(() => {
    const series = this.series();

    if (series.length < MINIMUM_POINTS) {
      return this.ariaLabel();
    }

    const values = series.map((point) => point.value);
    const currency = this.currencyCode();

    return `${this.ariaLabel()}. Mínima ${formatCurrency(Math.min(...values), currency)}, máxima ${formatCurrency(Math.max(...values), currency)}, último valor ${formatCurrency(values[values.length - 1], currency)}.`;
  });

  protected readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);
  protected readonly baseline = computed(() => this.height() - PADDING.bottom);
  protected readonly chartTop = PADDING.top;
  protected readonly chartRight = computed(() => this.width() - PADDING.right);

  constructor() {
    afterNextRender(() => this.observeWidth());
  }

  protected onPointerMove(event: PointerEvent): void {
    const element = this.surface()?.nativeElement;
    const plotted = this.plotted();

    if (element === undefined || plotted.length === 0) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    const ratio = this.width() / bounds.width;
    const position = (event.clientX - bounds.left) * ratio;
    const step = this.innerWidth() / Math.max(plotted.length - 1, 1);
    const index = Math.round((position - this.chartLeft()) / step);

    this.activeIndex.set(Math.min(Math.max(index, 0), plotted.length - 1));
  }

  protected onPointerLeave(): void {
    this.activeIndex.set(null);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const plotted = this.plotted();

    if (plotted.length === 0) {
      return;
    }

    const current = this.activeIndex() ?? plotted.length - 1;
    const nextIndex = this.resolveKeyboardIndex(event.key, current, plotted.length);

    if (nextIndex === null) {
      return;
    }

    event.preventDefault();
    this.activeIndex.set(nextIndex);
  }

  private resolveKeyboardIndex(key: string, current: number, total: number): number | null {
    if (key === 'ArrowRight') {
      return Math.min(current + 1, total - 1);
    }

    if (key === 'ArrowLeft') {
      return Math.max(current - 1, 0);
    }

    if (key === 'Home') {
      return 0;
    }

    if (key === 'End') {
      return total - 1;
    }

    if (key === 'Escape') {
      this.activeIndex.set(null);
    }

    return null;
  }

  private resolveAnchor(tickIndex: number, total: number): 'start' | 'middle' | 'end' {
    if (tickIndex === 0) {
      return 'start';
    }

    return tickIndex === total - 1 ? 'end' : 'middle';
  }

  private innerWidth(): number {
    return Math.max(this.width() - this.chartLeft() - PADDING.right, 1);
  }

  private innerHeight(): number {
    return Math.max(this.height() - PADDING.top - PADDING.bottom, 1);
  }

  private formatAxisLabel(timestamp: number): string {
    const date = new Date(timestamp);
    const spansMultipleDays = this.seriesSpanInDays() > 2;

    return spansMultipleDays
      ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      : date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  private seriesSpanInDays(): number {
    const series = this.series();

    if (series.length < MINIMUM_POINTS) {
      return 0;
    }

    const span = series[series.length - 1].timestamp - series[0].timestamp;

    return span / 86_400_000;
  }

  private observeWidth(): void {
    const element = this.host.nativeElement;
    const observer = new ResizeObserver((entries) => {
      const measured = entries[0]?.contentRect.width ?? 0;

      if (measured > 0) {
        this.width.set(measured);
      }
    });

    observer.observe(element);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }
}
