import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'crypto-progress-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="track"
      role="progressbar"
      [attr.aria-label]="barLabel()"
      [attr.aria-valuenow]="percentage()"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span class="fill" [style.width.%]="percentage()"></span>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .track {
      height: 0.375rem;
      border-radius: var(--radius-pill);
      background: var(--color-surface-sunken);
      overflow: hidden;
    }

    .fill {
      display: block;
      height: 100%;
      border-radius: var(--radius-pill);
      background: var(--color-accent);
      transition: width var(--duration-slow) var(--ease-out);
    }
  `,
})
export class ProgressBarComponent {
  readonly ratio = input.required<number | null>();
  readonly barLabel = input<string>('Progresso');

  protected readonly percentage = computed(() => {
    const ratio = this.ratio();

    if (ratio === null || !Number.isFinite(ratio)) {
      return 0;
    }

    return Math.round(Math.min(Math.max(ratio, 0), 1) * 100);
  });
}
