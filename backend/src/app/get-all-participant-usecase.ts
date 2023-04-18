import { IParticipantQS } from './query-service-interface/participant-qs';

/**
 * 全ての参加者を取得するユースケース
 */
export class GetAllParticipantUseCase {
  private readonly userQS: IParticipantQS;

  public constructor(userQS: IParticipantQS) {
    this.userQS = userQS;
  }

  public async do() {
    return await this.userQS.getAll();
  }
}
