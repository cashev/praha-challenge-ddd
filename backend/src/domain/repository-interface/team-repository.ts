import { Team } from 'src/domain/entity/team';

export interface ITeamRepository {
  findByParticipantId(participantId: string): Promise<Team | null>;
  getSmallestTeamList(): Promise<Team[] | null>;
  save(team: Team): Promise<void>;
}
