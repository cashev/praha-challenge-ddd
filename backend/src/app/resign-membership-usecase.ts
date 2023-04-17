import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository';
import { INotificationSender } from 'src/domain/notifier-interface/notification-sender';
import { Taikai, Zaiseki } from 'src/domain/value-object/participantStatus';
import { Notification } from 'src/domain/entity/notification';
import { createRandomIdString } from 'src/util/random';

// 参加者が退会するユースケース
export class ResignMembershipUsecase {
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

  async do(participantId: string) {
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
    participant.status = Taikai;
    const result = await team.removeParticipant(participant);
    if (result == false) {
      const notification = Notification.create(createRandomIdString(), {title: 'テスト件名', content: 'テスト内容'});
      await this.notificationSender.sendToAdmin(notification);
      throw new Error('')
    }
    
    await this.teamRepo.save(team);
    await this.participantRepo.save(participant);
  }
}
