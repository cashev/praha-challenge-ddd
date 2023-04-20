import { PrismaClient } from '@prisma/client';
import {
  IParticipantNameQS,
  IParticipantQS,
  ParticipantDto,
  ParticipantNameDto,
} from 'src/app/query-service-interface/participant-qs';

export class ParticipantQS implements IParticipantQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<ParticipantDto[]> {
    const users = await this.prismaClient.participant.findMany();
    return users.map((participant) => new ParticipantDto({ ...participant }));
  }
}

export class ParticipantNameQS implements IParticipantNameQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getNames(ids: string[]): Promise<ParticipantNameDto[]> {
    const users = await this.prismaClient.participant.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return users.map(
      (participant) => new ParticipantNameDto({ ...participant }),
    );
  }
}
