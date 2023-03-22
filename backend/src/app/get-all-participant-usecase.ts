import { IParticipantQS } from './query-service-interface/participant-qs';

export class GetAllParticipantUseCase {
  private readonly userQS: IParticipantQS;

  public constructor(userQS: IParticipantQS) {
    this.userQS = userQS;
  }

  public async do() {
    try {
      return await this.userQS.getAll();
    } catch (error) {
      throw error;
    }
  }
}
