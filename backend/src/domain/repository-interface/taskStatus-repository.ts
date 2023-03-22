import { TaskStatus } from 'src/domain/entity/taskStatus';

export interface ITaskStatusRepository {
  find(participantId: number, taskId: number): Promise<TaskStatus>;
  save(taskStatus: TaskStatus): Promise<void>;
}
