import { PrismaClient } from '@prisma/client';
import { Pair } from 'src/domain/entity/pair';
import { ParticipantIdType } from 'src/domain/entity/participant';
import { Team } from 'src/domain/entity/team';
import { ITeamRepository } from 'src/domain/repository-interface/team-repository';
import { PairName } from 'src/domain/value-object/pairName';
import { TeamName } from 'src/domain/value-object/teamName';

export class TeamRepository implements ITeamRepository {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async findByParticipantId(participantId: string): Promise<Team | null> {
    const result = await this.prismaClient.team.findFirst({
      where: {
        AND: {
          pairs: {
            some: {
              pair: {
                participants: {
                  some: {
                    participantId,
                  },
                },
              },
            },
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
      return null;
    }
    const pairList = result.pairs
      .map((tp) => tp.pair)
      .map((p) => {
        return Pair.create(p.id, {
          pairName: PairName.create(p.name),
          member: p.participants.map(
            (p2) => p2.participantId as ParticipantIdType,
          ),
        });
      });
    return Team.create(result.id, {
      teamName: TeamName.create(result.name),
      pairList,
    });
  }

  async getSmallestTeamList(): Promise<Team[] | null> {
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
    const countMember = await this.prismaClient.team_Participant.groupBy({
      by: ['teamId'],
      _count: {
        teamId: true,
      },
    });
    const minSize = Math.min(...countMember.map((c) => c._count.teamId));
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
      return Team.create(team.id, {
        teamName: TeamName.create(team.name),
        pairList: team.pairs
          .map((tp) => tp.pair)
          .map((pair) => {
            return Pair.create(pair.id, {
              pairName: PairName.create(pair.name),
              member: pair.participants.map(
                (pp) => pp.participantId as ParticipantIdType,
              ),
            });
          }),
      });
    });
    return ret;
  }

  async save(team: Team): Promise<void> {
    await this.prismaClient.$transaction(async (tx) => {
      await tx.team.upsert({
        where: { id: team.id },
        update: {
          name: team.teamName.getValue(),
        },
        create: {
          id: team.id,
          name: team.teamName.getValue(),
        },
      });
      team.pairList.map(async (pair) => {
        await tx.pair.upsert({
          where: { id: pair.id },
          update: {
            name: pair.pairName.getValue(),
          },
          create: {
            id: pair.id,
            name: pair.pairName.getValue(),
          },
        });
      });
      await tx.pair_Participant.deleteMany({
        where: {
          pair: {
            team: {
              some: {
                teamId: team.id,
              },
            },
          },
        },
      });
      await tx.pair_Participant.createMany({
        data: team.pairList
          .flatMap((pair) => {
            return pair.member.map((id) => {
              return { pairId: pair.id, participantId: id };
            });
          })
          .map((p2) => {
            return { pairId: p2.pairId, participantId: p2.participantId };
          }),
      });
      await tx.team_Pair.deleteMany({
        where: {
          teamId: team.id,
        },
      });
      await tx.team_Pair.createMany({
        data: team.pairList.map((pair) => {
          return { teamId: team.id, pairId: pair.id };
        }),
      });
    });
  }
}

// type TeamPairDto = {
//   teamId: string;
//   teamName: string;
//   pairId: string;
//   pairName: string;
//   participantId: string;
// };
