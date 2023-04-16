import { PrismaClient } from '@prisma/client';
import { GetByTaskStatusResponse } from './response/task-status-response';
import { ParticipantByTaskStatusQS } from 'src/infra/db/query-service/participant-by-taskStatus-qs';
import { GetByTaskStatusUsecase } from 'src/app/get-by-taskStatus-usecase';
import { Controller, Get, ParseArrayPipe, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller({
  path: '/taskStatus',
})
export class TaskStatusController {
  @Get()
  @ApiResponse({ status: 200, type: GetByTaskStatusResponse })
  async getByTaskStatus(
    @Query('taskIds', new ParseArrayPipe({ items: String, separator: ',' }))
    taskIds: string[],
    @Query('status')
    status: string,
    @Query('page')
    page?: number,
  ): Promise<GetByTaskStatusResponse> {
    const prisma = new PrismaClient();
    const qs = new ParticipantByTaskStatusQS(prisma);
    const usecase = new GetByTaskStatusUsecase(qs);
    const result = await usecase.do(taskIds, status, page);
    const response = new GetByTaskStatusResponse({ participants: result });
    return response;
  }
}
