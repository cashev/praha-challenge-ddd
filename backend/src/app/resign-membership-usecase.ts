import { Option, none, some } from 'fp-ts/lib/Option';
import { isLeft } from 'fp-ts/lib/Either';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository';
import { IRemovalTeamMemberValidator } from './util/removal-team-member-validator';
import { ParticipantIdType } from 'src/domain/entity/participant';

/**
 * 参加者が退会するユースケース
 */
export class ResignMembershipUsecase {
  constructor(
    private readonly teamRepo: ITeamRepository,
    private readonly removalTeamMemberValidator: IRemovalTeamMemberValidator,
  ) {}

  /**
   * 指定された参加者をチームから取り除きます。
   * 参加者が抜けてペアが1人になる場合、チーム内でペアを再編成します。
   * チームメンバーが最低人数を下回る場合、管理者へ通知します。
   *
   * @param participantId 参加者id
   */
  async do(participantId: string): Promise<Option<Error>> {
    const pid = participantId as ParticipantIdType;
    const validateResult =
      await this.removalTeamMemberValidator.validateFromParticipantId(pid);
    if (isLeft(validateResult)) {
      return some(validateResult.left);
    }
    const team = validateResult.right;
    team.removeParticipant(pid);
    this.teamRepo.save(team);
    return none;
  }
}
