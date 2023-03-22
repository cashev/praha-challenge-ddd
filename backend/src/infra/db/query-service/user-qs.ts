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

  public async findById(id: number): Promise<ParticipantDto> {
    const user = await this.prismaClient.user.findUniqueOrThrow({
      where: { id },
    });
    return new ParticipantDto({ ...user });
  }

  public async getAll(): Promise<ParticipantDto[]> {
    const users = await this.prismaClient.user.findMany();
    return users.map((user) => new ParticipantDto({ ...user }));
  }
}
