import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'crypto-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
  host: { '[class]': '"state state--" + tone()' },
})
export class EmptyStateComponent {
  readonly icon = input<string>('compass');
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly tone = input<'neutral' | 'error'>('neutral');
}
