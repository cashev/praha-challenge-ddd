import { ITeamQS } from './query-service-interface/team-qs';

/**
 * 全てのチームを取得するユースケース
 */
export class GetAllTeamUseCase {
  private readonly teamQS: ITeamQS;

  public constructor(teamQS: ITeamQS) {
    this.teamQS = teamQS;
  }

  public async do() {
    return await this.teamQS.getAll();
  }
}
