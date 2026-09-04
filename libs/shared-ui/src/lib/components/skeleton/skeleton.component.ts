import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'crypto-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    '[style.border-radius]': 'circle() ? "50%" : radius()',
    '[attr.aria-hidden]': 'true',
  },
  styles: `
    :host {
      display: block;
      background: linear-gradient(
        90deg,
        var(--color-skeleton) 0%,
        var(--color-skeleton-shine) 50%,
        var(--color-skeleton) 100%
      );
      background-size: 200% 100%;
      animation: skeleton-shimmer 1.4s var(--ease-in-out) infinite;
    }

    @keyframes skeleton-shimmer {
      from {
        background-position: 200% 0;
      }
      to {
        background-position: -200% 0;
      }
    }
  `,
})
export class SkeletonComponent {
  readonly width = input<string>('100%');
  readonly height = input<string>('1rem');
  readonly radius = input<string>('var(--radius-sm)');
  readonly circle = input<boolean>(false);
}
