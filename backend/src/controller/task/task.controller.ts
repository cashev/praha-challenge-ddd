import { PrismaClient } from '@prisma/client';
import { GetAllTaskResponse } from './response/task-response';
import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { TaskQS } from 'src/query/infra/db/task-qs';
import { GetAllTaskUseCase } from 'src/query/usecase/get-all-task-usecase';

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
