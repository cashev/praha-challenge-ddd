import { createTaskStatusValue } from 'src/domain/value-object/taskStatusValue';
import { ITaskStatusRepository } from '../domain/repository-interface/taskStatus-repository';
import { isNone } from 'fp-ts/lib/Option';

/**
 * 課題進捗ステータスを更新するユースケースです。
 */
export class UpdateTaskStatusUseCase {
  readonly taskStatusRepo: ITaskStatusRepository;

  constructor(taskStatusRepo: ITaskStatusRepository) {
    this.taskStatusRepo = taskStatusRepo;
  }

  /**
   * 指定した参加者の課題進捗ステータスを更新します。
   *
   * @param participantId 参加者id
   * @param taskId 課題id
   * @param status 課題進捗ステータス
   */
  async do(participantId: string, taskId: string, status: string) {
    const newStatus = createTaskStatusValue(status);
    const tsResult = await this.taskStatusRepo.find(participantId, taskId);
    if (isNone(tsResult)) {
      throw new Error();
    }
    const taskStatus = tsResult.value;
    taskStatus.status = newStatus;
    await this.taskStatusRepo.save(taskStatus);
  }
}
