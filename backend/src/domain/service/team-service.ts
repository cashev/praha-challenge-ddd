import { ITeamRepository } from 'src/app/repository-interface/team-repository';
import { User } from '../entity/user';
import { TeamName } from '../value-object/teamName';

export class TeamService {
  private readonly teamRepo: ITeamRepository;
  constructor(teamRepo: ITeamRepository) {
    this.teamRepo = teamRepo;
  }

  async isDuplicated(teamName: TeamName): Promise<boolean> {
    const team = await this.teamRepo.findByName(teamName.value);
    return team !== null;
  }

  async isSameTeam(member: User[]): Promise<boolean> {
    const team = await this.teamRepo.findByUserId(member[0].id);
    const teamMemberIdSet = new Set(team.member.map((user) => user.id));
    return member.map((user) => user.id).every((id) => teamMemberIdSet.has(id));
  }
}
