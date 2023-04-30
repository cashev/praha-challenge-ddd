import { INotification } from 'src/domain/notification-interface/notification';
import { INotificationSender } from 'src/domain/notification-interface/notification-sender';

export class MockNotificationSender implements INotificationSender {
  private readonly notifications: INotification[] = [];

  sendToAdmin(notification: INotification): Promise<void> {
    this.notifications.push(notification);
    return Promise.resolve();
  }

  getAll(): readonly INotification[] {
    return this.notifications;
  }
}
