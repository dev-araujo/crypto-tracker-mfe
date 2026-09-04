import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { formatInteger } from '@crypto/shared-utils';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'crypto-paginator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  readonly offset = input.required<number>();
  readonly limit = input.required<number>();
  readonly total = input.required<number>();
  readonly pageSizes = input<readonly number[]>([10, 25, 50]);
  readonly offsetChange = output<number>();
  readonly limitChange = output<number>();

  protected readonly currentPage = computed(() => Math.floor(this.offset() / this.limit()) + 1);
  protected readonly totalPages = computed(() =>
    Math.max(Math.ceil(this.total() / this.limit()), 1),
  );
  protected readonly isFirstPage = computed(() => this.offset() <= 0);
  protected readonly isLastPage = computed(() => this.currentPage() >= this.totalPages());

  protected readonly rangeLabel = computed(() => {
    const total = this.total();

    if (total === 0) {
      return 'Nenhum resultado';
    }

    const first = this.offset() + 1;
    const last = Math.min(this.offset() + this.limit(), total);

    return `${formatInteger(first)}–${formatInteger(last)} de ${formatInteger(total)}`;
  });

  protected goToPrevious(): void {
    this.offsetChange.emit(Math.max(this.offset() - this.limit(), 0));
  }

  protected goToNext(): void {
    this.offsetChange.emit(this.offset() + this.limit());
  }

  protected onPageSizeChange(event: Event): void {
    this.limitChange.emit(Number((event.target as HTMLSelectElement).value));
  }
}
