import { ITaskStatusQS } from './query-service-interface/task-status-qs';

/**
 * 1ページに表示する参加者の人数
 */
const PARTICIPANT_TAKE_PER_PAGE = 10;

/**
 * 特定の課題(複数指定可能)について特定の進捗ステータスとなっている参加者をページングして取得するユースケース
 */
export class GetByTaskStatusUsecase {
  private qs: ITaskStatusQS;
  constructor(qs: ITaskStatusQS) {
    this.qs = qs;
  }

  /**
   * 特定の課題(複数指定可能)について特定の進捗ステータスとなっている参加者をページングして取得します。
   *
   * @param taskIds 特定の課題リスト
   * @param status 特定の進捗ステータス
   * @param page ページ(0 index)
   * @returns 対象の参加者リスト
   */
  async do(taskIds: string[], status: string, page = 0) {
    const skip = PARTICIPANT_TAKE_PER_PAGE * page;
    return await this.qs.getWithPagination(
      taskIds,
      status,
      skip,
      PARTICIPANT_TAKE_PER_PAGE,
    );
  }
}
