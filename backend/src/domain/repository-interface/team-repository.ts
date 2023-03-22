import { Team } from 'src/domain/entity/team';

export interface ITeamRepository {
  findByName(name: string): Promise<Team>;
  findByParticipantId(id: number): Promise<Team>;
  getSmallestTeamList(): Promise<Team[]>;
  getNextPairId(): Promise<number>;
  save(team: Team): Promise<Team>;
}
