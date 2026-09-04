import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  input,
  output,
  viewChild,
} from '@angular/core';

let dialogCount = 0;

@Component({
  selector: 'crypto-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  readonly open = input.required<boolean>();
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly confirmLabel = input<string>('Confirmar');
  readonly cancelLabel = input<string>('Cancelar');
  readonly tone = input<'neutral' | 'danger'>('neutral');

  readonly confirmed = output<void>();
  readonly dismissed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly titleId = `confirm-dialog-title-${(dialogCount += 1)}`;
  protected readonly descriptionId = `confirm-dialog-description-${dialogCount}`;

  constructor() {
    effect(() => this.syncVisibility(this.open()));
  }

  protected onCancel(event: Event): void {
    event.preventDefault();
    this.dismissed.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.dismissed.emit();
    }
  }

  private syncVisibility(isOpen: boolean): void {
    const element = this.dialog().nativeElement;

    if (isOpen === element.open) {
      return;
    }

    if (isOpen) {
      element.showModal();

      return;
    }

    element.close();
  }
}
