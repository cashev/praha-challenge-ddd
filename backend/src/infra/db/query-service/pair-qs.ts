import { PrismaClient } from '@prisma/client';
import { IPairQS, PairDto } from 'src/app/query-service-interface/pair-qs';

export class PairQS implements IPairQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<PairDto[]> {
    const pairs = await this.prismaClient.pair.findMany();
    return pairs.map((pair) => new PairDto({ ...pair }));
  }
}
