import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'crypto-watch-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  template: `
    <button
      type="button"
      class="toggle"
      [class.toggle--active]="active()"
      [attr.aria-pressed]="active()"
      [attr.aria-label]="accessibleLabel()"
      [attr.title]="accessibleLabel()"
      (click)="onClick($event)"
    >
      <crypto-icon [name]="active() ? 'star-filled' : 'star'" [size]="size()" />

      @if (showLabel()) {
        <span class="toggle__label">{{ active() ? 'Na watchlist' : 'Acompanhar' }}</span>
      }
    </button>
  `,
  styleUrl: './watch-toggle.component.scss',
})
export class WatchToggleComponent {
  readonly active = input.required<boolean>();
  readonly coinName = input.required<string>();
  readonly showLabel = input<boolean>(false);
  readonly size = input<number>(18);
  readonly toggled = output<void>();

  protected readonly accessibleLabel = computed(() =>
    this.active()
      ? `Remover ${this.coinName()} da watchlist`
      : `Adicionar ${this.coinName()} à watchlist`,
  );

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.toggled.emit();
  }
}
