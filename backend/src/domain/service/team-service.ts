import { ITeamRepository } from 'src/app/repository-interface/team-repository';
import { TeamName } from '../value-object/teamName';

export class TeamService {
  private readonly teamRepo: ITeamRepository;
  constructor(teamRepo: ITeamRepository) {
    this.teamRepo = teamRepo;
  }

  async isDuplicated(teamName: TeamName): Promise<boolean> {
    const team = await this.teamRepo.findByName(teamName.value);
    return Promise.resolve(team !== null);
  }
}
