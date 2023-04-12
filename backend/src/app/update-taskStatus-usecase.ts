import { createTaskStatusValue } from 'src/domain/value-object/taskStatusValue';
import { ITaskStatusRepository } from '../domain/repository-interface/taskStatus-repository';

export class UpdateTaskStatusUseCase {
  readonly taskStatusRepo: ITaskStatusRepository;

  constructor(taskStatusRepo: ITaskStatusRepository) {
    this.taskStatusRepo = taskStatusRepo;
  }

  async do(participantId: string, taskId: string, status: string) {
    const newStatus = createTaskStatusValue(status);
    const taskStatus = await this.taskStatusRepo.find(participantId, taskId);
    taskStatus.status = newStatus;
    await this.taskStatusRepo.save(taskStatus);
  }
}
