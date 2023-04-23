import { PrismaClient } from '@prisma/client';
import { Option, none, some } from 'fp-ts/lib/Option';
import { ParticipantIdType } from 'src/domain/entity/participant';
import { TaskIdType, TaskStatus } from 'src/domain/entity/taskStatus';
import { ITaskStatusRepository } from 'src/domain/repository-interface/taskStatus-repository';
import {
  convertToString,
  createTaskStatusValue,
} from 'src/domain/value-object/taskStatusValue';

export class TaskStatusRepository implements ITaskStatusRepository {
  private prismaClient: PrismaClient;

  public constructor(prismaClient: PrismaClient) {
    this.prismaClient = prismaClient;
  }

  async find(
    participantId: string,
    taskId: string,
  ): Promise<Option<TaskStatus>> {
    const result = await this.prismaClient.taskStatus.findFirst({
      where: {
        participantId,
        taskId,
      },
    });
    if (result == null) {
      return none;
    }
    const taskStatus = TaskStatus.create(result.id, {
      participantId: result.participantId as ParticipantIdType,
      taskId: result.taskId as TaskIdType,
      status: createTaskStatusValue(result.status),
    });
    return some(taskStatus);
  }

  async save(taskStatus: TaskStatus): Promise<void> {
    await this.prismaClient.taskStatus.update({
      where: {
        participantId_taskId: {
          participantId: taskStatus.participantId,
          taskId: taskStatus.taskId,
        },
      },
      data: {
        status: convertToString(taskStatus.status),
      },
    });
  }

  async saveAll(taskStatusList: TaskStatus[]): Promise<void> {
    await this.prismaClient.taskStatus.createMany({
      data: taskStatusList.map((ts) => {
        return {
          id: ts.id,
          participantId: ts.participantId,
          taskId: ts.taskId,
          status: convertToString(ts.status),
        };
      }),
    });
  }
}
