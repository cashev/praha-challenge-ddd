import { ITaskStatusQS } from './query-service-interface/task-status-qs';

/**
 * 全ての課題を取得するユースケース
 */
export class GetAllTaskStatusUseCase {
  private readonly tsQS: ITaskStatusQS;

  public constructor(tsQS: ITaskStatusQS) {
    this.tsQS = tsQS;
  }

  public async do() {
    return await this.tsQS.getAll();
  }
}
