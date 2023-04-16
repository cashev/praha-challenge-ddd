import { PrismaClient } from '@prisma/client';
import { GetAllTaskResponse } from './response/task-response';
import { GetAllTaskUseCase } from 'src/app/get-all-task-usecase';
import { TaskQS } from 'src/infra/db/query-service/task-qs';
import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Controller({
  path: '/task',
})
export class TaskController {
  @Get()
  @ApiResponse({ status: 200, type: GetAllTaskResponse })
  async getAllTasks(): Promise<GetAllTaskResponse> {
    const prisma = new PrismaClient();
    const qs = new TaskQS(prisma);
    const usecase = new GetAllTaskUseCase(qs);
    const result = await usecase.do();
    const response = new GetAllTaskResponse({ taskDtos: result });
    return response;
  }
}
