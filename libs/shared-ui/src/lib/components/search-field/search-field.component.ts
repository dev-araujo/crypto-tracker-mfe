import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { IconComponent } from '../icon/icon.component';

const TYPING_DEBOUNCE = 350;

@Component({
  selector: 'crypto-search-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './search-field.component.html',
  styleUrl: './search-field.component.scss',
})
export class SearchFieldComponent {
  readonly value = model<string>('');
  readonly placeholder = input<string>('Pesquisar');
  readonly fieldLabel = input<string>('Pesquisar');
  readonly shortcutHint = input<string>('/');
  readonly search = output<string>();

  private readonly control = viewChild<ElementRef<HTMLInputElement>>('control');
  private readonly typed = new Subject<string>();

  constructor() {
    this.typed
      .pipe(debounceTime(TYPING_DEBOUNCE), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.search.emit(term));
  }

  focus(): void {
    this.control()?.nativeElement.focus();
  }

  protected onInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;

    this.value.set(term);
    this.typed.next(term.trim());
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.search.emit(this.value().trim());
  }

  protected clear(): void {
    this.value.set('');
    this.search.emit('');
    this.focus();
  }
}
