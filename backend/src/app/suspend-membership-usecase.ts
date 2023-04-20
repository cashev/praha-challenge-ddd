import { INotificationSender } from 'src/domain/notifier-interface/notification-sender';
import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository';
import { Kyukai } from 'src/domain/value-object/participantStatus';
import { RemoveMemberUsecase } from './remove-member-usecase';
import { IParticipantNameQS } from './query-service-interface/participant-qs';

// 参加者が休会するユースケース
export class SuspendMembershipUsecase {
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
    await usecase.do(participantId, Kyukai);
  }
}
