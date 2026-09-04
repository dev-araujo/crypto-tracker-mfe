export type NotificationTone = 'info' | 'success' | 'error';

export interface AppNotification {
  readonly id: number;
  readonly tone: NotificationTone;
  readonly message: string;
}
