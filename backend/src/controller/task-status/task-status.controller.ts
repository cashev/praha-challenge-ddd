import { PrismaClient } from '@prisma/client';
import { GetByTaskStatusResponse } from './response/task-status-response';
import { ParticipantByTaskStatusQS } from 'src/infra/db/query-service/participant-by-taskStatus-qs';
import { GetByTaskStatusUsecase } from 'src/app/get-by-taskStatus-usecase';
import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  PatchTaskStatusRequest,
  PostTaskStatusRequest,
} from './request/task-status-request';
import { TaskStatusRepository } from 'src/infra/db/repository/taskStatus-repository';
import { UpdateTaskStatusUseCase } from 'src/app/update-taskStatus-usecase';

@Controller({
  path: '/taskStatus',
})
export class TaskStatusController {
  @Post()
  @ApiResponse({ status: 200, type: GetByTaskStatusResponse })
  async getByTaskStatus(
    @Body()
    postTaskStatusRequest: PostTaskStatusRequest,
  ): Promise<GetByTaskStatusResponse> {
    const prisma = new PrismaClient();
    const qs = new ParticipantByTaskStatusQS(prisma);
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
    await usecase.do(participantId, taskId, status);
  }
}
