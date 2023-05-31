import { PrismaClient } from '@prisma/client';
import {
  IParticipantNameQS,
  IParticipantQS,
  ParticipantDto,
  ParticipantNameDto,
} from 'src/query/usecase/query-service-interface/participant-qs';

export class ParticipantQS implements IParticipantQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<ParticipantDto[]> {
    const participants = await this.prismaClient.participant.findMany();
    return participants.map(
      (participant) => new ParticipantDto({ ...participant }),
    );
  }
}

export class ParticipantNameQS implements IParticipantNameQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getNames(ids: string[]): Promise<ParticipantNameDto[]> {
    const result = await this.prismaClient.participant.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return result.map(
      (participant) => new ParticipantNameDto({ ...participant }),
    );
  }
}
