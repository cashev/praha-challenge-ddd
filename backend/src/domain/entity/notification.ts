import { Brand } from '../value-object/valueObject';
import { Entity } from './entity';

type NotificationIdType = Brand<string, 'NotificationId'>;

interface NotificationProps {
  title: string;
  content: string;
}

export class Notification extends Entity<
  NotificationIdType,
  NotificationProps
> {
  get id(): NotificationIdType {
    return this._id;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  private constructor(id: NotificationIdType, props: NotificationProps) {
    super(id, props);
  }

  public static create(id: string, props: NotificationProps): Notification {
    return new Notification(id as NotificationIdType, props);
  }
}
