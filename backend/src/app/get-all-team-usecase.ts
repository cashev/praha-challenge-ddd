import { ITeamQS } from './query-service-interface/team-qs';

export class GetAllTeamUseCase {
  private readonly teamQS: ITeamQS;

  public constructor(teamQS: ITeamQS) {
    this.teamQS = teamQS;
  }

  public async do() {
    try {
      return await this.teamQS.getAll();
    } catch (error) {
      throw error;
    }
  }
}
