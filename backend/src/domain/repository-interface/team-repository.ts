import { Team } from 'src/domain/entity/team';

export interface ITeamRepository {
  findByParticipantId(participantId: number): Promise<Team>;
  getSmallestTeamList(): Promise<Team[]>;
  getNextPairId(): Promise<number>;
  save(team: Team): Promise<Team>;
}
