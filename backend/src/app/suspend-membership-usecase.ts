import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository';
import { Kyukai, Zaiseki } from 'src/domain/value-object/participantStatus';

// 参加者が休会するユースケース
export class SuspendMembershipUsecase {
  private readonly participantRepo: IParticipantRepository;
  private readonly teamRepo: ITeamRepository;

  constructor(
    participantRepo: IParticipantRepository,
    teamRepo: ITeamRepository,
  ) {
    this.participantRepo = participantRepo;
    this.teamRepo = teamRepo;
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
    participant.status = Kyukai;
    team.removeParticipant(participant);

    this.teamRepo.save(team);
    this.participantRepo.save(participant);
  }
}
