import { PrismaClient } from '@prisma/client';
import { ITaskQS, TaskDto } from 'src/app/query-service-interface/task-qs';

export class TaskQS implements ITaskQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  public async getAll(): Promise<TaskDto[]> {
    const tasks = await this.prismaClient.task.findMany();
    return tasks.map((task) => new TaskDto({ ...task }));
  }
}
