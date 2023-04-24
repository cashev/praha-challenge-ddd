import { TaskIdType, TaskStatus } from '../entity/taskStatus';
import { Yet } from '../value-object/taskStatusValue';
import { ParticipantIdType } from '../entity/participant';
import { createRandomIdString } from 'src/util/random';

export class TaskStatusService {
  /**
   * 対象の参加者に対して課題進捗ステータスを作成します。
   * 
   * @param participantId 参加者id
   * @param taskIds 課題idのリスト
   * @returns 課題進捗ステータスのリスト
   */
  createTaskStatusForNewParticipant(
    participantId: ParticipantIdType,
    taskIds: TaskIdType[],
  ): TaskStatus[] {
    const ret = [];
    for (let i = 0; i < taskIds.length; i++) {
      const taskStatus = TaskStatus.create(createRandomIdString(), {
        participantId: participantId as ParticipantIdType,
        taskId: taskIds[i] as TaskIdType,
        status: Yet,
      });
      ret.push(taskStatus);
    }
    return ret;
  }
}
