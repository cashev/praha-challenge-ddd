import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetTeamResponse } from './response/team-response';
import { GetAllTeamUseCase } from 'src/app/get-all-team-usecase';
import { TeamQS } from 'src/infra/db/query-service/team-qs';

@Controller({
  path: '/team',
})
export class TeamController {
  @Get()
  @ApiResponse({ status: 200, type: GetTeamResponse })
  async getAll(): Promise<GetTeamResponse> {
    const prisma = new PrismaClient();
    const qs = new TeamQS(prisma);
    const usecase = new GetAllTeamUseCase(qs);
    const result = await usecase.do();
    const response = new GetTeamResponse({ teamDtos: result });
    return response;
  }
}
