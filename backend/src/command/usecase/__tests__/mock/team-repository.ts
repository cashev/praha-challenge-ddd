import { Option, none } from 'fp-ts/lib/Option';
import { Team } from 'src/command/domain/entity/team';
import { ITeamRepository } from 'src/command/domain/repository-interface/team-repository';

export class MockTeamRepository implements ITeamRepository {
  constructor(
    private findByParticipantIdResult: Option<Team> = none,
    private getSmallestTeamListResult: Option<Team[]> = none,
  ) {}

  findByParticipantId(participantId: string): Promise<Option<Team>> {
    participantId;
    return Promise.resolve(this.findByParticipantIdResult);
  }
  getSmallestTeamList(): Promise<Option<Team[]>> {
    return Promise.resolve(this.getSmallestTeamListResult);
  }
  save(team: Team): Promise<void> {
    team;
    return Promise.resolve();
  }
}
