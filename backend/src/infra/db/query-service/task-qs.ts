import { PrismaClient } from '@prisma/client';
import {
  ITaskIdQS,
  ITaskQS,
  TaskDto,
  TaskIdDto,
} from 'src/app/query-service-interface/task-qs';

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

export class TaskIdQS implements ITaskIdQS {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async getAll(): Promise<TaskIdDto[]> {
    const tasks = await this.prismaClient.task.findMany();
    return tasks.map((task) => new TaskIdDto({ id: task.id }));
  }
}
