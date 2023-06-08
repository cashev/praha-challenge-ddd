import { Brand } from '../value-object/valueObject';

export type NotificationIdType = Brand<string, 'NotificationId'>;

export interface INotification {
  getTitle(): string;
  getContent(): string;
}
