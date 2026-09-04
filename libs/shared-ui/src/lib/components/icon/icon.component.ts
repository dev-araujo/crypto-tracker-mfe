import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FALLBACK_ICON, ICON_PATHS } from './icon-paths.constant';

@Component({
  selector: 'crypto-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path [attr.d]="path()" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      line-height: 0;
      flex: none;
    }
  `,
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input<number>(20);

  protected readonly path = computed(() => ICON_PATHS[this.name()] ?? ICON_PATHS[FALLBACK_ICON]);
}
