import { PrismaClient } from '@prisma/client';
import { IParticipantByTaskStatusQS } from 'src/app/query-service-interface/participant-by-taskStatus-qs';
import { ParticipantDto } from 'src/app/query-service-interface/participant-qs';

export class ParticipantByTaskStatusQS implements IParticipantByTaskStatusQS {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async getWithPagination(
    taskIds: number[],
    status: string,
    skip: number,
    take: number,
  ): Promise<ParticipantDto[]> {
    const result = await this.prismaClient.participant.findMany({
      where: {
        AND: taskIds.map((taskId) => {
          return { TaskStatus: { some: { taskId, status } } };
        }),
      },
      skip,
      take,
    });
    return result.map((participant) => new ParticipantDto({ ...participant }));
  }
}
