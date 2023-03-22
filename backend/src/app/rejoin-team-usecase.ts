import { Pair } from 'src/domain/entity/pair';
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

    const team = await this.getSmallestTeam();
    const pair = team.getSmallestPair();

    participant.status = Zaiseki;
    this.participantRepo.save(participant);
    if (pair.isFullMember()) {
      const existingUser = randomChoice<Participant>([...pair.member]);
      pair.removeMember(existingUser);
      const newPair = Pair.create(await this.teamRepo.getNextPairId(), {
        pairName: team.getUnusedPairName(),
        member: [existingUser, participant],
      });
      team.addPair(newPair);
    } else {
      pair.addMember(participant);
    }
    this.teamRepo.save(team);
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
