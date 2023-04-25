import { Team } from 'src/domain/entity/team';
import { Zaiseki } from 'src/domain/value-object/participantStatus';
import { randomChoice } from 'src/util/random';
import { ITeamRepository } from '../domain/repository-interface/team-repository';
import { IParticipantRepository } from '../domain/repository-interface/participant-repository';
import { Participant } from 'src/domain/entity/participant';
import { isNone } from 'fp-ts/lib/Option';

/**
 * 休会中, 退会済の参加者が再度参加するユースケース
 */
export class RejoinParticipantUseCase {
  private readonly participantRepo: IParticipantRepository;
  private readonly teamRepo: ITeamRepository;

  constructor(
    participantRepo: IParticipantRepository,
    teamRepo: ITeamRepository,
  ) {
    this.participantRepo = participantRepo;
    this.teamRepo = teamRepo;
  }

  /**
   * 休会中, 退会済の参加者を在籍中に変更し、チーム, ペアに割り当てます。
   *
   * @param participantId 参加者id
   */
  async do(participantId: string) {
    const result = await this.participantRepo.find(participantId);
    if (isNone(result)) {
      throw new Error('存在しない参加者です。');
    }
    const participant = result.value;
    this.validate(participant);

    participant.status = Zaiseki;
    const tResult = await this.teamRepo.getSmallestTeamList();
    if (isNone(tResult)) {
      throw new Error();
    }
    const team = randomChoice<Team>(tResult.value);
    team.addParticipant(participant);

    this.teamRepo.save(team);
    this.participantRepo.save(participant);
  }

  private validate(participant: Participant) {
    if (participant.status === Zaiseki) {
      throw new Error('在籍中の参加者です。');
    }
  }
}
