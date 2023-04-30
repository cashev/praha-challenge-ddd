import { INotificationSender } from 'src/domain/notification-interface/notification-sender';
import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository';
import { Zaiseki } from 'src/domain/value-object/participantStatus';
import { IParticipantNameQS } from './query-service-interface/participant-qs';
import { ParticipantName } from 'src/domain/value-object/participantName';
import { isNone } from 'fp-ts/lib/Option';
import { Team } from 'src/domain/entity/team';
import { Participant } from 'src/domain/entity/participant';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import { MemberLimitNotification } from 'src/domain/entity/member-limit-notification';
import { InconsistentNotification } from 'src/domain/entity/inconsistent-notification';

export interface IRemoveMemberUsecase {
  /**
   * 指定した参加者をチーム, ペアから取り除きます。
   * 参加者が抜けてペアが1人になる場合、チーム内でペアを再編成します。
   * チームメンバーが最低人数を下回る場合、管理者へ通知します。
   *
   * @param participantId 参加者id
   * @returns left...エラー, right...取り除いた参加者
   */
  do(participantId: string): Promise<Either<Error, Participant>>;
}

/**
 * チームから参加者を取り除くユースケースです。
 */
export class RemoveMemberUsecase implements IRemoveMemberUsecase {
  private readonly participantRepo: IParticipantRepository;
  private readonly teamRepo: ITeamRepository;
  private readonly notificationSender: INotificationSender;
  private readonly participantNameQS: IParticipantNameQS;

  constructor(
    participantRepo: IParticipantRepository,
    teamRepo: ITeamRepository,
    notificationSender: INotificationSender,
    participantNameQS: IParticipantNameQS,
  ) {
    this.participantRepo = participantRepo;
    this.teamRepo = teamRepo;
    this.notificationSender = notificationSender;
    this.participantNameQS = participantNameQS;
  }

  async do(participantId: string): Promise<Either<Error, Participant>> {
    // 参加者を取得
    const findResult = await this.findMember(participantId);
    if (isLeft(findResult)) {
      return findResult;
    }
    const participant = findResult.right;

    const team = await this.findTeam(participant);
    // チーム, ペアから取り除く
    if (team.canRemoveParticipant() == false) {
      // チームの人数が規定の人数を下回る場合、管理者に通知する
      await this.notifyToAdmin(participant, team);
      return left(new Error(''));
    }
    team.removeParticipant(participant);

    await this.teamRepo.save(team);
    return right(participant);
  }

  private async findMember(
    participantId: string,
  ): Promise<Either<Error, Participant>> {
    const pResult = await this.participantRepo.find(participantId);
    if (isNone(pResult)) {
      return left(new Error('存在しない参加者です。'));
    }
    const participant = pResult.value;
    if (participant.status != Zaiseki) {
      return left(new Error('在籍中ではない参加者です。'));
    }
    return right(participant);
  }

  /**
   * 参加者が所属しているチームを取得します。
   *
   * @param participant 参加者
   * @returns チーム
   */
  private async findTeam(participant: Participant): Promise<Team> {
    const tResult = await this.teamRepo.findByParticipantId(participant.id);
    if (isNone(tResult)) {
      // 在籍中の参加者はどこかのチーム,ペアに所属しているはずのため、ここで見つからない場合はデータ不整合
      await this.notifyInconsistent(participant);
      throw new Error('データ不整合');
    }
    return tResult.value;
  }

  /**
   * データ不整合を管理者に通知します。
   *
   * @param participant 参加者
   */
  private async notifyInconsistent(participant: Participant) {
    const notification = InconsistentNotification.create({
      participantName: participant.participantName,
    });
    await this.notificationSender.sendToAdmin(notification);
  }

  /**
   * 参加者が取り除けないことを管理者に通知します。
   *
   * @param participant 参加者
   * @param team チーム
   */
  private async notifyToAdmin(participant: Participant, team: Team) {
    // チームの参加者名
    const participantNames = await this.participantNameQS.getNames([
      ...team.member,
    ]);
    const notification = MemberLimitNotification.create({
      targetParticipantName: participant.participantName,
      teamName: team.teamName,
      teamMemberNames: participantNames.map((dto) =>
        ParticipantName.create(dto.name),
      ),
    });
    await this.notificationSender.sendToAdmin(notification);
  }
}
