import { Team } from 'src/domain/entity/team';

export interface ITeamRepository {
  findByName(name: string): Promise<Team>;
  findByUserId(id: number): Promise<Team>;
}
