import { Option } from 'fp-ts/lib/Option';
import { TaskStatus } from 'src/domain/entity/taskStatus';

export interface ITaskStatusRepository {
  /**
   * 参加者id, 課題idから課題進捗ステータスを取得します。
   *
   * @param participantId 参加者id
   * @param taskId 課題id
   */
  find(participantId: string, taskId: string): Promise<Option<TaskStatus>>;
  /**
   * 課題進捗ステータスを保存します。
   *
   * @param taskStatus 課題進捗ステータス
   */
  save(taskStatus: TaskStatus): Promise<void>;
  /**
   * 課題進捗ステータスのリストを保存します。
   *
   * @param taskStatusList 課題進捗ステータスのリスト
   */
  saveAll(taskStatusList: TaskStatus[]): Promise<void>;
}
