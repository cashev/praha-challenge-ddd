import { PrismaClient } from '@prisma/client';
import {
  ITaskStatusQS,
  TaskStatusDto,
} from 'src/app/query-service-interface/task-status-qs';
import { ParticipantDto } from 'src/app/query-service-interface/participant-qs';

export class TaskStatusQS implements ITaskStatusQS {
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async getAll(): Promise<TaskStatusDto[]> {
    const result = await this.prismaClient.taskStatus.findMany();
    return result.map((ts) => new TaskStatusDto({ ...ts }));
  }

  async getWithPagination(
    taskIds: string[],
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
