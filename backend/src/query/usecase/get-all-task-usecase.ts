import { ITaskQS } from './query-service-interface/task-qs';

/**
 * 全ての課題を取得するユースケース
 */
export class GetAllTaskUseCase {
  private readonly taskQS: ITaskQS;

  public constructor(taskQS: ITaskQS) {
    this.taskQS = taskQS;
  }

  public async do() {
    return await this.taskQS.getAll();
  }
}
