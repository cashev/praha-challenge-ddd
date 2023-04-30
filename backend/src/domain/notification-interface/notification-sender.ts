import { INotification } from './notification';

export interface INotificationSender {
  /**
   * 管理者に通知します。
   *
   * @param notification 通知内容
   */
  sendToAdmin(notification: INotification): Promise<void>;
}
