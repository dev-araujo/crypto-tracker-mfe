import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'crypto-stat-tile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stat-tile.component.html',
  styleUrl: './stat-tile.component.scss',
})
export class StatTileComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly hint = input<string>('');
}
