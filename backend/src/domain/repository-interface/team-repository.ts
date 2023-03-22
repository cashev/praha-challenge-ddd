import { Team } from 'src/domain/entity/team';

export interface ITeamRepository {
  getSmallestTeamList(): Promise<Team[]>;
  getNextPairId(): Promise<number>;
  save(team: Team): Promise<Team>;
}
