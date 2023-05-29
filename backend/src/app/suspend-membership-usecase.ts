import { Option, none, some } from 'fp-ts/lib/Option';
import { isLeft } from 'fp-ts/lib/Either';
import { IRemovalTeamMemberValidator } from './util/removal-team-member-validator';
import { ParticipantIdType } from 'src/domain/entity/participant';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository';

/**
 * 参加者を休会にするユースケース
 */
export class SuspendMembershipUsecase {
  constructor(
    private readonly teamRepo: ITeamRepository,
    private readonly removalTeamMemberValidator: IRemovalTeamMemberValidator,
  ) {}

  /**
   * 指定された参加者の在籍ステータスを休会中へ更新します。
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
    team.suspendParticipant(pid);
    this.teamRepo.save(team);
    return none;
  }
}
