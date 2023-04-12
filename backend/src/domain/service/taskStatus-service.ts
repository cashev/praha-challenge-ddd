import { ITaskStatusRepository } from '../repository-interface/taskStatus-repository';
import { TaskIdType, TaskStatus } from '../entity/taskStatus';
import { Yet } from '../value-object/taskStatusValue';
import { ParticipantIdType } from '../entity/participant';
import { createRandomIdString } from 'src/util/random';

export class TaskStatusService {
  async createTaskStatusForNewParticipant(
    participantId: string,
    taskIds: string[],
  ): Promise<TaskStatus[]> {
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
