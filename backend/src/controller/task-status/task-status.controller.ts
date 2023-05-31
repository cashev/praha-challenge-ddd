import { PrismaClient } from '@prisma/client';
import {
  GetByTaskStatusResponse,
  GetTaskStatusResponse,
} from './response/task-status-response';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  PatchTaskStatusRequest,
  PostTaskStatusRequest,
} from './request/task-status-request';
import { isSome } from 'fp-ts/lib/Option';
import { TaskStatusQS } from 'src/query/infra/db/task-status-qs';
import { GetAllTaskStatusUseCase } from 'src/query/usecase/get-all-task-status-usecase';
import { GetByTaskStatusUsecase } from 'src/query/usecase/get-by-taskStatus-usecase';
import { TaskStatusRepository } from 'src/command/infra/db/taskStatus-repository';
import { UpdateTaskStatusUseCase } from 'src/command/usecase/update-taskStatus-usecase';

@Controller({
  path: '/taskStatus',
})
export class TaskStatusController {
  @Get()
  @ApiResponse({ status: 200, type: GetTaskStatusResponse })
  async getAll(): Promise<GetTaskStatusResponse> {
    const prisma = new PrismaClient();
    const qs = new TaskStatusQS(prisma);
    const usecase = new GetAllTaskStatusUseCase(qs);
    const result = await usecase.do();
    const response = new GetTaskStatusResponse({ taskStatusList: result });
    return response;
  }

  @Post()
  @ApiResponse({ status: 200, type: GetByTaskStatusResponse })
  async getByTaskStatus(
    @Body()
    postTaskStatusRequest: PostTaskStatusRequest,
  ): Promise<GetByTaskStatusResponse> {
    const prisma = new PrismaClient();
    const qs = new TaskStatusQS(prisma);
    const usecase = new GetByTaskStatusUsecase(qs);
    const { taskIds, status, page } = postTaskStatusRequest;
    const result = await usecase.do(taskIds, status, page);
    const response = new GetByTaskStatusResponse({ participants: result });
    return response;
  }

  @Patch()
  @ApiResponse({ status: 200 })
  async updateTaskStatus(
    @Body()
    patchTaskStatusRequest: PatchTaskStatusRequest,
  ): Promise<void> {
    const prisma = new PrismaClient();
    const taskStatusRepository = new TaskStatusRepository(prisma);
    const usecase = new UpdateTaskStatusUseCase(taskStatusRepository);
    const { participantId, taskId, status } = patchTaskStatusRequest;
    const result = await usecase.do(participantId, taskId, status);
    if (isSome(result)) {
      throw new BadRequestException(result.value.message);
    }
  }
}
