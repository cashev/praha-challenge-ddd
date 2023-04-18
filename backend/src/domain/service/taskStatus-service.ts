import { TaskIdType, TaskStatus } from '../entity/taskStatus';
import { Yet } from '../value-object/taskStatusValue';
import { ParticipantIdType } from '../entity/participant';
import { createRandomIdString } from 'src/util/random';
import { ITaskIdQS } from 'src/app/query-service-interface/task-qs';

export class TaskStatusService {
  private qs: ITaskIdQS;

  constructor(qs: ITaskIdQS) {
    this.qs = qs;
  }

  async createTaskStatusForNewParticipant(
    participantId: string,
  ): Promise<TaskStatus[]> {
    const taskIds = (await this.qs.getAll()).map((dto) => dto.id);

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
