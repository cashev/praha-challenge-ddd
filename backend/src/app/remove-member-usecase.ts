import { Notification } from 'src/domain/entity/notification';
import { INotificationSender } from 'src/domain/notifier-interface/notification-sender';
import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository';
import {
  ParticipantStatus,
  Zaiseki,
} from 'src/domain/value-object/participantStatus';
import { createRandomIdString } from 'src/util/random';

/**
 * チームから参加者を取り除くユースケースです。
 */
export class RemoveMemberUsecase {
  private readonly participantRepo: IParticipantRepository;
  private readonly teamRepo: ITeamRepository;
  private readonly notificationSender: INotificationSender;

  constructor(
    participantRepo: IParticipantRepository,
    teamRepo: ITeamRepository,
    notificationSender: INotificationSender,
  ) {
    this.participantRepo = participantRepo;
    this.teamRepo = teamRepo;
    this.notificationSender = notificationSender;
  }

  /**
   * 指定された参加者をチームから取り除き、指定された在籍ステースタへ更新します。    
   * 参加者が抜けてペアが1人になる場合、チーム内でペアを再編成します。    
   * チームメンバーが最低人数を下回る場合、管理者へ通知します。
   *
   * @param participantId 取り除く参加者id
   * @param newStatus 在籍ステータス
   */
  async do(participantId: string, newStatus: ParticipantStatus) {
    if (newStatus == Zaiseki) {
      throw new Error(
        '取り除く参加者のステータスを在籍中へ変更できません。休会中または退会済を指定してください。',
      );
    }
    const participant = await this.participantRepo.find(participantId);
    if (participant == null) {
      throw new Error('存在しない参加者です。');
    }
    if (participant.status != Zaiseki) {
      throw new Error('在籍中ではない参加者です。');
    }

    const team = await this.teamRepo.findByParticipantId(participantId);
    if (team == null) {
      throw new Error();
    }
    if (team.canRemoveParticipant() == false) {
      // チームの人数が規定の人数を下回る場合、管理者に通知する
      // TOOD 件名, 本文
      // どの参加者
      // チーム名
      // チームの参加者名
      const notification = Notification.create(createRandomIdString(), {
        title: 'テスト件名',
        content: 'テスト内容',
      });
      await this.notificationSender.sendToAdmin(notification);
      throw new Error('');
    }

    participant.status = newStatus;
    team.removeParticipant(participant);

    await this.teamRepo.save(team);
    await this.participantRepo.save(participant);
  }
}
