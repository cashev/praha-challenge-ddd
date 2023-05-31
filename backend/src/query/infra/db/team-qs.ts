import { PrismaClient } from '@prisma/client';
import {
  ITeamQS,
  TeamDto,
} from 'src/query/usecase/query-service-interface/team-qs';

export class TeamQS implements ITeamQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<TeamDto[]> {
    const result = await this.prismaClient.team.findMany({
      include: {
        pairs: {
          include: {
            pair: {
              include: {
                participants: {
                  include: {
                    participant: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const teams = result.map((t) => {
      return {
        id: t.id,
        name: t.name,
        pairs: t.pairs.map((p) => {
          return {
            pairId: p.pairId,
            pairName: p.pair.name,
            participants: p.pair.participants.map((pp) => {
              return {
                participantId: pp.participantId,
                participantName: pp.participant.name,
                status: pp.status,
              };
            }),
          };
        }),
      };
    });
    return teams.map((team) => new TeamDto({ ...team }));
  }
}
