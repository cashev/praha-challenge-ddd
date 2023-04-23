import { Option, none } from 'fp-ts/lib/Option';
import { TaskStatus } from 'src/domain/entity/taskStatus';
import { ITaskStatusRepository } from 'src/domain/repository-interface/taskStatus-repository';

export class MockTaskStatusRepository implements ITaskStatusRepository {
  constructor(private findResult: Option<TaskStatus> = none) {}

  find(participantId: string, taskId: string): Promise<Option<TaskStatus>> {
    return Promise.resolve(this.findResult);
  }
  save(taskStatus: TaskStatus): Promise<void> {
    return Promise.resolve();
  }
  saveAll(taskStatusList: TaskStatus[]): Promise<void> {
    return Promise.resolve();
  }
}
