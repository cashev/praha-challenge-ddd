import { ITaskStatusRepository } from '../repository-interface/taskStatus-repository';
import { TaskIdType, TaskStatus } from '../entity/taskStatus';
import { Yet } from '../value-object/taskStatusValue';
import { ParticipantIdType } from '../entity/participant';

export class TaskStatusService {
  private taskStatusRepo: ITaskStatusRepository;

  constructor(taskStatusRepo: ITaskStatusRepository) {
    this.taskStatusRepo = taskStatusRepo;
  }

  async createTaskStatusForNewParticipant(
    participantId: number,
    taskIds: number[],
  ): Promise<TaskStatus[]> {
    const startId = await this.taskStatusRepo.getNextIdAndSetNext(
      taskIds.length,
    );
    const ret = [];
    for (let i = 0; i < taskIds.length; i++) {
      const id = startId + i;
      const taskStatus = TaskStatus.create(id, {
        participantId: participantId as ParticipantIdType,
        taskId: taskIds[i] as TaskIdType,
        status: Yet,
      });
      ret.push(taskStatus);
    }
    return ret;
  }
}
