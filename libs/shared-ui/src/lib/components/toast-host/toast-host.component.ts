import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationStore } from '@crypto/shared-state';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'crypto-toast-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './toast-host.component.html',
  styleUrl: './toast-host.component.scss',
})
export class ToastHostComponent {
  private readonly store = inject(NotificationStore);

  protected readonly notifications = this.store.notifications;

  protected iconFor(tone: string): string {
    if (tone === 'error') {
      return 'alert';
    }

    return tone === 'success' ? 'check' : 'info';
  }

  protected dismiss(id: number): void {
    this.store.dismiss(id);
  }
}
