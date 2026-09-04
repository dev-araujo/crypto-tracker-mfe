import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { SegmentOption } from '../../models/segment-option.model';

@Component({
  selector: 'crypto-segmented-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './segmented-control.component.html',
  styleUrl: './segmented-control.component.scss',
})
export class SegmentedControlComponent<TValue extends string = string> {
  readonly options = input.required<readonly SegmentOption<TValue>[]>();
  readonly value = model.required<TValue>();
  readonly groupLabel = input<string>('Opções');

  protected select(option: SegmentOption<TValue>): void {
    if (option.value !== this.value()) {
      this.value.set(option.value);
    }
  }
}
