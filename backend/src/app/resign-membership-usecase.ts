import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository';
import { INotificationSender } from 'src/domain/notifier-interface/notification-sender';
import { Taikai } from 'src/domain/value-object/participantStatus';
import { RemoveMemberUsecase } from './remove-member-usecase';
import { IParticipantNameQS } from './query-service-interface/participant-qs';
import { Option } from 'fp-ts/lib/Option';

/**
 * 参加者の在籍ステータスを退会済にするユースケース
 */
export class ResignMembershipUsecase {
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

  /**
   * 指定された参加者をチームから取り除き、在籍ステータスを退会済へ更新します。
   * 参加者が抜けてペアが1人になる場合、チーム内でペアを再編成します。
   * チームメンバーが最低人数を下回る場合、管理者へ通知します。
   *
   * @param participantId 参加者id
   */
  async do(participantId: string): Promise<Option<Error>> {
    const usecase = new RemoveMemberUsecase(
      this.participantRepo,
      this.teamRepo,
      this.notificationSender,
      this.participantNameQS,
    );
    return await usecase.do(participantId, Taikai);
  }
}
