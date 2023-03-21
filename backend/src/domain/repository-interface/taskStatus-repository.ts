import { TaskStatus } from 'src/domain/entity/taskStatus';

export interface ITaskStatusRepository {
  find(userId: number, taskId: number): Promise<TaskStatus>;
  save(taskStatus: TaskStatus): Promise<void>;
}
