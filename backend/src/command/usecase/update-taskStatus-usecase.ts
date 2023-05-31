import { ITaskStatusRepository } from '../domain/repository-interface/taskStatus-repository';
import { Option, isNone, none, some } from 'fp-ts/lib/Option';
import { isLeft } from 'fp-ts/lib/Either';
import { createTaskStatusValue } from '../domain/value-object/taskStatusValue';

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
  async do(
    participantId: string,
    taskId: string,
    status: string,
  ): Promise<Option<Error>> {
    const statusEither = createTaskStatusValue(status);
    if (isLeft(statusEither)) {
      return some(statusEither.left);
    }
    const newStatus = statusEither.right;
    const tsResult = await this.taskStatusRepo.find(participantId, taskId);
    if (isNone(tsResult)) {
      return some(
        new Error(
          '課題進捗ステータスが見つかりません。参加者id: ' +
            participantId +
            ', 課題id: ' +
            taskId,
        ),
      );
    }
    const taskStatus = tsResult.value;
    try {
      taskStatus.status = newStatus;
    } catch (e) {
      return some(e);
    }
    await this.taskStatusRepo.save(taskStatus);
    return none;
  }
}
