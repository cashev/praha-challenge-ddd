import { ParticipantDto } from './participant-qs';

export interface IParticipantByTaskStatusQS {
  /**
   * 特定の課題について特定の進捗ステータスとなっている参加者をページングして取得します。
   * 
   * @param taskIds 課題idのリスト
   * @param status 課題ステータス
   * @param skip スキップするレコード数
   * @param take 取得するレコード数
   */
  getWithPagination(
    taskIds: string[],
    status: string,
    skip: number,
    take: number,
  ): Promise<ParticipantDto[]>;
}
