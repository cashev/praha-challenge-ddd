import { createRandomIdString } from 'src/util/random';
import {
  INotification,
  NotificationIdType,
} from '../notification-interface/notification';
import { ParticipantName } from '../value-object/participantName';
import { TeamName } from '../value-object/teamName';
import { Entity } from './entity';

interface NotificationProps {
  targetParticipantName: ParticipantName;
  teamName: TeamName;
  teamMemberNames: ParticipantName[];
}

export class MemberLimitNotification
  extends Entity<NotificationIdType, NotificationProps>
  implements INotification
{
  getTitle(): string {
    return '[警告] 参加者が減りチームの人数が規定値を下回ります。';
  }
  getContent(): string {
    const content = `チームの人数が3人を下回ることになるため、以下参加者をチームから取り除くことができません。
    対象者: ${this.props.targetParticipantName.getValue()}
    チーム名: ${this.props.teamName.getValue()}
    チーム参加者名:
    ${this.props.teamMemberNames.forEach((pName) => `  ${pName.getValue()}\n`)}
    `;
    return content;
  }

  private constructor(id: NotificationIdType, props: NotificationProps) {
    super(id, props);
  }

  public static create(props: NotificationProps): INotification {
    const id = createRandomIdString() as NotificationIdType;
    props.teamMemberNames = [...props.teamMemberNames];
    return new MemberLimitNotification(id, props);
  }
}
