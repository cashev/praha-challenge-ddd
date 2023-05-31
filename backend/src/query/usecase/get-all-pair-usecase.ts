import { IPairQS } from './query-service-interface/pair-qs';

/**
 * 全てのペアを取得するユースケース
 */
export class GetAllPairUseCase {
  private readonly pairQS: IPairQS;

  public constructor(pairQS: IPairQS) {
    this.pairQS = pairQS;
  }

  public async do() {
    return await this.pairQS.getAll();
  }
}
