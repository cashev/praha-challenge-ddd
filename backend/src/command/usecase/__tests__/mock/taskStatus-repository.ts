import { Option, none } from 'fp-ts/lib/Option';
import { TaskStatus } from 'src/command/domain/entity/taskStatus';
import { ITaskStatusRepository } from 'src/command/domain/repository-interface/taskStatus-repository';

export class MockTaskStatusRepository implements ITaskStatusRepository {
  private readonly taskStatusList: TaskStatus[] = [];

  constructor(private findResult: Option<TaskStatus> = none) {}

  find(participantId: string, taskId: string): Promise<Option<TaskStatus>> {
    participantId;
    taskId;
    return Promise.resolve(this.findResult);
  }
  save(taskStatus: TaskStatus): Promise<void> {
    taskStatus;
    return Promise.resolve();
  }
  saveAll(taskStatusList: TaskStatus[]): Promise<void> {
    taskStatusList;
    this.taskStatusList.push(...taskStatusList);
    return Promise.resolve();
  }

  getAll(): readonly TaskStatus[] {
    return this.taskStatusList;
  }
}
