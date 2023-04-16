import { PrismaClient } from '@prisma/client';
import { GetByTaskStatusResponse } from './response/task-status-response';
import { ParticipantByTaskStatusQS } from 'src/infra/db/query-service/participant-by-taskStatus-qs';
import { GetByTaskStatusUsecase } from 'src/app/get-by-taskStatus-usecase';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PostTaskStatusRequest } from './request/task-status-request';

@Controller({
  path: '/taskStatus',
})
export class TaskStatusController {
  @Post()
  @ApiResponse({ status: 200, type: GetByTaskStatusResponse })
  async getByTaskStatus(
    @Body()
    taskStatusPostRequest: PostTaskStatusRequest,
  ): Promise<GetByTaskStatusResponse> {
    const prisma = new PrismaClient();
    const qs = new ParticipantByTaskStatusQS(prisma);
    const usecase = new GetByTaskStatusUsecase(qs);
    const { taskIds, status, page } = taskStatusPostRequest;
    const result = await usecase.do(taskIds, status, page);
    const response = new GetByTaskStatusResponse({ participants: result });
    return response;
  }
}
