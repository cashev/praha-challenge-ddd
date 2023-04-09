import { TaskStatus } from 'src/domain/entity/taskStatus';

export interface ITaskStatusRepository {
  find(participantId: number, taskId: number): Promise<TaskStatus>;
  getNextIdAndSetNext(skip: number): Promise<number>;
  save(taskStatus: TaskStatus): Promise<void>;
}
