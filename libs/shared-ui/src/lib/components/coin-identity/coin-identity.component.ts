import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'crypto-coin-identity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coin-identity.component.html',
  styleUrl: './coin-identity.component.scss',
  host: { '[class]': '"identity identity--" + size()' },
})
export class CoinIdentityComponent {
  readonly name = input.required<string>();
  readonly symbol = input.required<string>();
  readonly iconUrl = input.required<string>();
  readonly rank = input<number | null>(null);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
}
