import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetTeamResponse } from './response/team-response';
import { TeamQS } from 'src/query/infra/db/team-qs';
import { GetAllTeamUseCase } from 'src/query/usecase/get-all-team-usecase';

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
