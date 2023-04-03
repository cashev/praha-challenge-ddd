import { PrismaClient } from '@prisma/client';
import { ITeamQS, TeamDto } from 'src/app/query-service-interface/team-qs';

export class TeamQS implements ITeamQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<TeamDto[]> {
    const teams = await this.prismaClient.team.findMany();
    return teams.map((team) => new TeamDto({ ...team }));
  }
}
