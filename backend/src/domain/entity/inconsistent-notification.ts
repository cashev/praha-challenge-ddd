import { ParticipantName } from '../value-object/participantName';
import {
  INotification,
  NotificationIdType,
} from '../notification-interface/notification';
import { Entity } from './entity';
import { createRandomIdString } from 'src/util/random';

interface NotificationProps {
  participantName: ParticipantName;
}

export class InconsistentNotification
  extends Entity<NotificationIdType, NotificationProps>
  implements INotification
{
  getTitle(): string {
    return '[警告] チームに所属していない在籍中の参加者がいます。';
  }
  getContent(): string {
    return `以下参加者の在籍ステータスが在籍中となっていますが、チームに所属していません。
          参加者名: ${this.props.participantName.getValue()}
        `;
  }

  private constructor(id: NotificationIdType, props: NotificationProps) {
    super(id, props);
  }

  public static create(props: NotificationProps): INotification {
    const id = createRandomIdString() as NotificationIdType;
    return new InconsistentNotification(id, props);
  }
}
