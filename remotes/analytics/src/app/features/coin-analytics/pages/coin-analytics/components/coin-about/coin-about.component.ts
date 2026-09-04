import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'analytics-coin-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coin-about.component.html',
  styleUrl: './coin-about.component.scss',
})
export class CoinAboutComponent {
  readonly coinName = input.required<string>();
  readonly description = input.required<string>();
}
