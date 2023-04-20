import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository';
import { INotificationSender } from 'src/domain/notifier-interface/notification-sender';
import { Taikai } from 'src/domain/value-object/participantStatus';
import { RemoveMemberUsecase } from './remove-member-usecase';
import { IParticipantNameQS } from './query-service-interface/participant-qs';

// TOOD 休会中, 退会済を一つにまとめる
// 参加者が退会するユースケース
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

  async do(participantId: string) {
    const usecase = new RemoveMemberUsecase(
      this.participantRepo,
      this.teamRepo,
      this.notificationSender,
      this.participantNameQS,
    );
    await usecase.do(participantId, Taikai);
  }
}
