import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastHostComponent, ThemeService } from '@crypto/shared-ui';
import { LayoutComponent } from './core/layout/layout.component';

@Component({
  selector: 'shell-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LayoutComponent, ToastHostComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly theme = inject(ThemeService);
}
