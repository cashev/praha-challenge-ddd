import { PrismaClient } from '@prisma/client';
import {
  IParticipantQS,
  ParticipantDto,
} from 'src/app/query-service-interface/participant-qs';

export class ParticipantQS implements IParticipantQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async findById(id: string): Promise<ParticipantDto> {
    const user = await this.prismaClient.participant.findUniqueOrThrow({
      where: { id },
    });
    return new ParticipantDto({ ...user });
  }

  public async getAll(): Promise<ParticipantDto[]> {
    const users = await this.prismaClient.participant.findMany();
    return users.map((participant) => new ParticipantDto({ ...participant }));
  }
}
