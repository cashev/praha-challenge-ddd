import { ParticipantName } from '../value-object/participantName';
import {
  ParticipantStatus,
  getParticipantStatusValue,
} from '../value-object/participantStatus';
import { TeamName } from '../value-object/teamName';
import { Brand } from '../value-object/valueObject';
import { Entity } from './entity';

type NotificationIdType = Brand<string, 'NotificationId'>;

interface NotificationProps {
  targetParticipantName: ParticipantName;
  newStatus: ParticipantStatus;
  teamName: TeamName;
  teamMemberNames: ParticipantName[];
}

export class Notification extends Entity<
  NotificationIdType,
  NotificationProps
> {
  get id(): NotificationIdType {
    return this._id;
  }

  get title(): string {
    return '[警告] 参加者が減りチームの人数が規定値を下回ります。';
  }

  get content(): string {
    const content = `チームの人数が3人を下回ることになるため、参加者のステータスを${getParticipantStatusValue(
      this.props.newStatus,
    )}へ変更することができません。
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

  public static create(id: string, props: NotificationProps): Notification {
    props.teamMemberNames = [...props.teamMemberNames];
    return new Notification(id as NotificationIdType, props);
  }
}
