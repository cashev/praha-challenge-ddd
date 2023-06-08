import { PrismaClient } from '@prisma/client';
import {
  IPairQS,
  PairDto,
} from 'src/query/usecase/query-service-interface/pair-qs';

export class PairQS implements IPairQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<PairDto[]> {
    const result = await this.prismaClient.pair.findMany({
      include: {
        participants: {
          include: {
            participant: true,
          },
        },
      },
    });
    const pairs = result.map((p) => {
      return {
        id: p.id,
        name: p.name,
        participants: p.participants.map((pp) => {
          return {
            participantId: pp.participantId,
            participantName: pp.participant.name,
          };
        }),
      };
    });
    return pairs.map((pair) => new PairDto({ ...pair }));
  }
}
