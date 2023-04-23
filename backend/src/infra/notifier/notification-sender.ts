import { Notification } from 'src/domain/entity/notification';
import { INotificationSender } from 'src/domain/notifier-interface/notification-sender';
import * as nodemailer from 'nodemailer';

export class NotificationSender implements INotificationSender {
  private smtp: nodemailer.Transporter;

  private HOST_MAIL_ADDRESS = 'from@example.com';
  private ADMIN_MAIL_ADDRESS = 'to@example.com';

  public constructor() {
    this.smtp = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
    });
  }

  async sendToAdmin(notification: Notification): Promise<void> {
    const message = {
      from: this.HOST_MAIL_ADDRESS,
      to: this.ADMIN_MAIL_ADDRESS,
      subject: notification.title,
      text: notification.content,
    };
    this.smtp.sendMail(message);
  }
}
