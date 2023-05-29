import { ITeamRepository } from '../domain/repository-interface/team-repository';
import { Option, isNone, isSome, none, some } from 'fp-ts/lib/Option';
import { ParticipantIdType } from 'src/domain/entity/participant';

/**
 * 休会中, 退会済の参加者が再度参加するユースケース
 */
export class RejoinParticipantUseCase {
  constructor(private readonly teamRepo: ITeamRepository) {}

  /**
   * 休会中の参加者を在籍中に変更し、チーム, ペアに割り当てます。
   *
   * @param participantId 参加者id
   */
  async do(participantId: string): Promise<Option<Error>> {
    const pid = participantId as ParticipantIdType;
    // 休会中の参加者はどこかのチームに所属はしている
    const tResult = await this.teamRepo.findByParticipantId(pid);
    if (isNone(tResult)) {
      return some(new Error('存在しない参加者です。'));
    }
    const team = tResult.value;
    const joinResult = team.joinParticipant(pid);
    if (isSome(joinResult)) {
      return joinResult;
    }
    this.teamRepo.save(team);
    return none;
  }
}
