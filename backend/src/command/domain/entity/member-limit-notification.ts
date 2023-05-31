import { createRandomIdString } from 'src/util/random';
import {
  INotification,
  NotificationIdType,
} from '../notification-interface/notification';
import { ParticipantName } from '../value-object/participantName';
import { TeamName } from '../value-object/teamName';
import { Entity } from './entity';

export class MemberLimitNotification
  extends Entity<NotificationIdType>
  implements INotification
{
  getTitle(): string {
    return '[警告] 参加者が減りチームの人数が規定値を下回ります。';
  }
  getContent(): string {
    const content = `チームの人数が3人を下回ることになるため、以下参加者をチームから取り除くことができません。
    対象者: ${this.targetParticipantName.getValue()}
    チーム名: ${this.teamName.getValue()}
    チーム参加者名:
    ${this.teamMemberNames.forEach((pName) => `  ${pName.getValue()}\n`)}
    `;
    return content;
  }

  private constructor(
    id: NotificationIdType,
    private readonly targetParticipantName: ParticipantName,
    private readonly teamName: TeamName,
    private readonly teamMemberNames: ParticipantName[],
  ) {
    super(id);
  }

  public static create(params: {
    targetParticipantName: ParticipantName;
    teamName: TeamName;
    teamMemberNames: ParticipantName[];
  }): INotification {
    const id = createRandomIdString() as NotificationIdType;
    const targetParticipantName = params.targetParticipantName;
    const teamName = params.teamName;
    const teamMemberNames = [...params.teamMemberNames];
    return new MemberLimitNotification(
      id,
      targetParticipantName,
      teamName,
      teamMemberNames,
    );
  }
}
