import { PrismaClient } from '@prisma/client';
import { Option, none, some } from 'fp-ts/lib/Option';
import { Team } from 'src/domain/entity/team';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository';

export class TeamRepository implements ITeamRepository {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async findByParticipantId(participantId: string): Promise<Option<Team>> {
    const result = await this.prismaClient.team.findFirst({
      where: {
        participants: {
          some: {
            participantId,
          },
        },
      },
      include: {
        pairs: {
          include: {
            pair: {
              include: {
                participants: true,
              },
            },
          },
        },
      },
    });
    if (result == null) {
      return none;
    }
    const team = Team.create(
      result.id,
      result.name,
      result.pairs
        .map((tp) => tp.pair)
        .map((p) => {
          return {
            pairId: p.id,
            pairName: p.name,
            member: p.participants.map((pp) => {
              return { participantId: pp.participantId, status: pp.status };
            }),
          };
        }),
    );
    return some(team);
  }

  async getSmallestTeamList(): Promise<Option<Team[]>> {
    // const results = await this.prismaClient.$queryRaw<[TeamPairDto]>`
    // select t.id "teamId", t.name "teamName", p.id "pairId", p.name "pairName", pp."participantId" "participantId"
    // from "Team" t
    // inner join "Team_Pair" tp on tp."teamId" = t.id
    // inner join "Pair" p on p.id = tp."pairId"
    // inner join "Pair_Participant" pp on pp."pairId" = p.id
    // where t.id in (
    //   select tp2."teamId" from "Team_Pair" tp2
    //   inner join "Pair" p2 on p2.id = tp2."pairId"
    //   inner join "Pair_Participant" pp2 on pp2."pairId" = p2.id
    //   group by tp2."teamId"
    //   having count(1) = (
    //     select max(count(1)) from "Team_Pair" tp3
    //     inner join "Pair" p3 on p3.id = tp3."pairId"
    //     inner join "Pair_Participant" pp3 on pp3."pairId" = p3.id
    //     group by tp3."teamId"
    //   )
    // )`;
    // ↑みたいに1クエリで取得したかったけど、できなかったので断念
    // チームごとの参加者数
    const countMember = await this.prismaClient.team_Participant.groupBy({
      by: ['teamId'],
      _count: {
        teamId: true,
      },
    });
    // 最小人数
    const minSize = Math.min(...countMember.map((c) => c._count.teamId));
    // 最小人数を持つチームid
    const teamIds = await this.prismaClient.team_Participant.groupBy({
      by: ['teamId'],
      having: {
        teamId: {
          _count: {
            equals: minSize,
          },
        },
      },
    });
    const ids = teamIds.map((t) => t.teamId);
    const teams = await this.prismaClient.team.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        pairs: {
          include: {
            pair: {
              include: {
                participants: true,
              },
            },
          },
        },
      },
    });
    const ret = teams.map((team) => {
      return Team.create(
        team.id,
        team.name,
        team.pairs
          .map((tp) => tp.pair)
          .map((p) => {
            return {
              pairId: p.id,
              pairName: p.name,
              member: p.participants.map((pp) => {
                return { participantId: pp.participantId, status: pp.status };
              }),
            };
          }),
      );
    });
    return some(ret);
  }

  async save(team: Team): Promise<void> {
    await this.prismaClient.$transaction(async (tx) => {
      await tx.team.upsert({
        where: { id: team.id },
        update: {
          name: team.name.getValue(),
        },
        create: {
          id: team.id,
          name: team.name.getValue(),
        },
      });
      team.getPairs().map(async (pair) => {
        await tx.pair.upsert({
          where: { id: pair.id },
          update: {
            name: pair.name.getValue(),
          },
          create: {
            id: pair.id,
            name: pair.name.getValue(),
          },
        });
      });
      await tx.pair_Participant.deleteMany({
        where: {
          OR: [
            {
              pair: {
                team: {
                  some: {
                    teamId: team.id,
                  },
                },
              },
            },
            {
              pairId: {
                in: team.getPairs().map((p) => p.id),
              },
            },
            {
              participantId: {
                in: team.getAllMember().map((m) => m.participantId),
              },
            },
          ],
        },
      });
      await tx.pair_Participant.createMany({
        data: team.getPairs().flatMap((pair) => {
          return pair.getAllMember().map((ps) => {
            return {
              pairId: pair.id,
              participantId: ps.participantId,
              status: ps.getStatusValue(),
            };
          });
        }),
      });
      await tx.team_Pair.deleteMany({
        where: {
          teamId: team.id,
        },
      });
      await tx.team_Pair.createMany({
        data: team.getPairs().map((pair) => {
          return { teamId: team.id, pairId: pair.id };
        }),
      });
      await tx.team_Participant.deleteMany({
        where: {
          OR: [
            { teamId: team.id },
            {
              participantId: {
                in: team.getAllMember().map((m) => m.participantId),
              },
            },
          ],
        },
      });
      await tx.team_Participant.createMany({
        data: team.getPairs().flatMap((pair) => {
          return pair.getAllMember().map((ps) => {
            return { teamId: team.id, participantId: ps.participantId };
          });
        }),
      });
    });
  }
}
