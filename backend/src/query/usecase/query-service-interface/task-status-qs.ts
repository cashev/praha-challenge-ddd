import { ParticipantDto } from './participant-qs';

export class TaskStatusDto {
  public readonly id: string;
  public readonly participantId: string;
  public readonly taskId: string;
  public readonly status: string;

  public constructor(props: {
    id: string;
    participantId: string;
    taskId: string;
    status: string;
  }) {
    const { id, participantId, taskId, status } = props;
    this.id = id;
    this.participantId = participantId;
    this.taskId = taskId;
    this.status = status;
  }
}

export interface ITaskStatusQS {
  /**
   * 全ての課題進捗ステータスを取得します。
   */
  getAll(): Promise<TaskStatusDto[]>;

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
