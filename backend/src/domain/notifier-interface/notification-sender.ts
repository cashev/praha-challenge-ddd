import { Notification } from '../entity/notification';

export interface INotificationSender {
  sendToAdmin(notification: Notification): Promise<void>;
}
