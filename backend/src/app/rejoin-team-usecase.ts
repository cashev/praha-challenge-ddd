import { Team } from 'src/domain/entity/team';
import { Zaiseki } from 'src/domain/value-object/participantStatus';
import { randomChoice } from 'src/util/RandomChoice';
import { ITeamRepository } from '../domain/repository-interface/team-repository';
import { IParticipantRepository } from '../domain/repository-interface/participant-repository';
import { Participant } from 'src/domain/entity/participant';

// 休会中, 退会済の参加者が復帰するユースケース
export class RejoinTeamUseCase {
  private readonly participantRepo: IParticipantRepository;
  private readonly teamRepo: ITeamRepository;

  constructor(
    participantRepo: IParticipantRepository,
    teamRepo: ITeamRepository,
  ) {
    this.participantRepo = participantRepo;
    this.teamRepo = teamRepo;
  }

  async do(participantId: number) {
    const participant = await this.participantRepo.find(participantId);
    this.validate(participant);

    participant.status = Zaiseki;
    const team = await this.getSmallestTeam();
    team.addParticipant(participant, this.teamRepo);

    this.teamRepo.save(team);
    this.participantRepo.save(participant);
  }

  private validate(participant: Participant) {
    if (participant == null) {
      throw new Error('存在しない参加者です。');
    }
    if (participant.status === Zaiseki) {
      throw new Error('在籍中の参加者です。');
    }
  }

  private async getSmallestTeam(): Promise<Team> {
    const teams = await this.teamRepo.getSmallestTeamList();
    return randomChoice<Team>(teams);
  }
}
