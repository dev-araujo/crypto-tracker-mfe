import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 32;
const MINIMUM_POINTS = 2;

@Component({
  selector: 'crypto-sparkline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sparkline.component.html',
  styleUrl: './sparkline.component.scss',
  host: { '[class]': '"sparkline sparkline--" + trend()' },
})
export class SparklineComponent {
  readonly points = input.required<readonly number[]>();
  readonly trend = input<'up' | 'down' | 'flat'>('flat');

  protected readonly viewBox = `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`;

  protected readonly linePath = computed(() => this.buildPath(this.coordinates()));

  protected readonly areaPath = computed(() => {
    const coordinates = this.coordinates();

    if (coordinates.length < MINIMUM_POINTS) {
      return '';
    }

    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];

    return `${this.buildPath(coordinates)} L ${last.x} ${VIEWBOX_HEIGHT} L ${first.x} ${VIEWBOX_HEIGHT} Z`;
  });

  protected readonly hasData = computed(() => this.coordinates().length >= MINIMUM_POINTS);

  private readonly coordinates = computed(() => {
    const values = this.points();

    if (values.length < MINIMUM_POINTS) {
      return [];
    }

    const lowest = Math.min(...values);
    const highest = Math.max(...values);
    const range = highest - lowest || 1;
    const step = VIEWBOX_WIDTH / (values.length - 1);

    return values.map((value, index) => ({
      x: Number((index * step).toFixed(2)),
      y: Number((VIEWBOX_HEIGHT - ((value - lowest) / range) * VIEWBOX_HEIGHT).toFixed(2)),
    }));
  });

  private buildPath(coordinates: readonly { x: number; y: number }[]): string {
    if (coordinates.length < MINIMUM_POINTS) {
      return '';
    }

    return coordinates
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');
  }
}
