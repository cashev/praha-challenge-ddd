import { IParticipantNameQS } from '../../../query/usecase/query-service-interface/participant-qs';
import { isNone } from 'fp-ts/lib/Option';
import { Either, left, right } from 'fp-ts/lib/Either';
import { ParticipantIdType } from 'src/command/domain/entity/participant';
import { Team } from 'src/command/domain/entity/team';
import { ITeamRepository } from 'src/command/domain/repository-interface/team-repository';
import { INotificationSender } from 'src/command/domain/notification-interface/notification-sender';
import { MemberLimitNotification } from 'src/command/domain/entity/member-limit-notification';
import { ParticipantName } from 'src/command/domain/value-object/participantName';

export interface IRemovalTeamMemberValidator {
  validateFromParticipantId(
    participantId: ParticipantIdType,
  ): Promise<Either<Error, Team>>;
}

export class RemovalTeamMemberValidator implements IRemovalTeamMemberValidator {
  constructor(
    private readonly teamRepo: ITeamRepository,
    private readonly notificationSender: INotificationSender,
    private readonly participantNameQS: IParticipantNameQS,
  ) {}

  async validateFromParticipantId(
    participantId: ParticipantIdType,
  ): Promise<Either<Error, Team>> {
    const tResult = await this.teamRepo.findByParticipantId(participantId);
    if (isNone(tResult)) {
      return left(
        new Error(
          '指定した参加者idの所属するチームが見つかりません。参加者id: ' +
            participantId,
        ),
      );
    }
    const team = tResult.value;
    if (!team.canRemoveParticipant()) {
      // チームの人数が規定の人数を下回る場合、管理者に通知する
      await this.notifyToAdmin(participantId, team);
      return left(
        new Error('チームの人数が規定数を下回るため参加者を取り除けません。'),
      );
    }
    return right(team);
  }

  /**
   * 参加者が取り除けないことを管理者に通知します。
   *
   * @param participant 参加者
   * @param team チーム
   */
  private async notifyToAdmin(participantId: ParticipantIdType, team: Team) {
    // チームの参加者名
    const participantNames = await this.participantNameQS.getNames([
      ...team.getZaisekiMember().map((m) => m.participantId),
    ]);
    const notification = MemberLimitNotification.create({
      targetParticipantName: ParticipantName.create(
        participantNames.filter((pn) => pn.id == participantId)[0].name,
      ),
      teamName: team.name,
      teamMemberNames: participantNames.map((dto) =>
        ParticipantName.create(dto.name),
      ),
    });
    await this.notificationSender.sendToAdmin(notification);
  }
}
