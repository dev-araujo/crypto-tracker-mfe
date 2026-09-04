import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '@crypto/shared-ui';

@Component({
  selector: 'shell-app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
})
export class AppFooterComponent {
  protected readonly currentYear = new Date().getFullYear();
}
