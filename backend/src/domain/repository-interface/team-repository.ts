import { Team } from 'src/domain/entity/team';

export interface ITeamRepository {
  findByParticipantId(participantId: string): Promise<Team>;
  getSmallestTeamList(): Promise<Team[]>;
  save(team: Team): Promise<Team>;
}
