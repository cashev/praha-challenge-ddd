import { IParticipantRepository } from 'src/domain/repository-interface/participant-repository';
import { Kyukai } from 'src/domain/value-object/participantStatus';
import { IRemoveMemberUsecase } from './remove-member-usecase';
import { Option, none, some } from 'fp-ts/lib/Option';
import { isLeft } from 'fp-ts/lib/Either';

/**
 * 参加者の在籍ステータスを休会中にするユースケース
 */
export class SuspendMembershipUsecase {
  private readonly participantRepo: IParticipantRepository;
  private readonly removeMemberUsecase: IRemoveMemberUsecase;

  constructor(
    participantRepo: IParticipantRepository,
    removeMemberUsecase: IRemoveMemberUsecase,
  ) {
    this.participantRepo = participantRepo;
    this.removeMemberUsecase = removeMemberUsecase;
  }

  /**
   * 指定された参加者をチームから取り除き、在籍ステータスを休会中へ更新します。
   * 参加者が抜けてペアが1人になる場合、チーム内でペアを再編成します。
   * チームメンバーが最低人数を下回る場合、管理者へ通知します。
   *
   * @param participantId 参加者id
   */
  async do(participantId: string): Promise<Option<Error>> {
    const removeResult = await this.removeMemberUsecase.do(participantId);
    if (isLeft(removeResult)) {
      return some(removeResult.left);
    }
    const participant = removeResult.right;
    participant.status = Kyukai;
    this.participantRepo.save(participant);
    return none;
  }
}
