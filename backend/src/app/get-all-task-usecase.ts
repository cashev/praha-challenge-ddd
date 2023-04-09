import { ITaskQS } from './query-service-interface/task-qs';

export class GetAllTaskUseCase {
  private readonly taskQS: ITaskQS;

  public constructor(taskQS: ITaskQS) {
    this.taskQS = taskQS;
  }

  public async do() {
    try {
      return await this.taskQS.getAll();
    } catch (error) {
      throw error;
    }
  }
}
