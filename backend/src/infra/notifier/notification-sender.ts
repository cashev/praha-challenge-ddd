import { INotificationSender } from 'src/domain/notification-interface/notification-sender';
import * as nodemailer from 'nodemailer';
import { INotification } from 'src/domain/notification-interface/notification';

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

  async sendToAdmin(notification: INotification): Promise<void> {
    const message = {
      from: this.HOST_MAIL_ADDRESS,
      to: this.ADMIN_MAIL_ADDRESS,
      subject: notification.getTitle(),
      text: notification.getContent(),
    };
    this.smtp.sendMail(message);
  }
}
