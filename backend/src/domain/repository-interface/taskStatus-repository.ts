import { TaskStatus } from 'src/domain/entity/taskStatus';

export interface ITaskStatusRepository {
  find(participantId: string, taskId: string): Promise<TaskStatus>;
  save(taskStatus: TaskStatus): Promise<void>;
  saveAll(taskStatusList: TaskStatus[]): Promise<void>;
}
