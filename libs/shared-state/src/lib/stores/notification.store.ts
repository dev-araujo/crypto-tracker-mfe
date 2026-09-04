import { Injectable, signal } from '@angular/core';
import { AppNotification, NotificationTone } from '../models/notification.model';

const AUTO_DISMISS_DELAY = 5000;

@Injectable({ providedIn: 'root' })
export class NotificationStore {
  private readonly _notifications = signal<readonly AppNotification[]>([]);
  private nextId = 0;

  readonly notifications = this._notifications.asReadonly();

  notifySuccess(message: string): void {
    this.push('success', message);
  }

  notifyError(message: string): void {
    this.push('error', message);
  }

  notifyInfo(message: string): void {
    this.push('info', message);
  }

  dismiss(id: number): void {
    this._notifications.update((current) => current.filter((item) => item.id !== id));
  }

  private push(tone: NotificationTone, message: string): void {
    const id = this.nextId++;

    this._notifications.update((current) => [...current, { id, tone, message }]);
    globalThis.setTimeout(() => this.dismiss(id), AUTO_DISMISS_DELAY);
  }
}
