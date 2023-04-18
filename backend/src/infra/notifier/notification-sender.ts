import { Notification } from 'src/domain/entity/notification';
import { INotificationSender } from 'src/domain/notifier-interface/notification-sender';
import * as nodemailer from 'nodemailer';

export class NotificationSender implements INotificationSender {
  private smtp: nodemailer.Transporter;

  public constructor() {
    this.smtp = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
    });
  }

  async sendToAdmin(notification: Notification): Promise<void> {
    const message = {
      from: 'from@example.com',
      to: 'to@example.com',
      subject: notification.title,
      text: notification.content,
    };

    this.smtp.sendMail(message);
  }
}
