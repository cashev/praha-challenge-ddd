import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetPairResponse } from './response/pair-response';
import { PairQS } from 'src/query/infra/db/pair-qs';
import { GetAllPairUseCase } from 'src/query/usecase/get-all-pair-usecase';

@Controller({
  path: '/pair',
})
export class PairController {
  @Get()
  @ApiResponse({ status: 200, type: GetPairResponse })
  async getAll(): Promise<GetPairResponse> {
    const prisma = new PrismaClient();
    const qs = new PairQS(prisma);
    const usecase = new GetAllPairUseCase(qs);
    const result = await usecase.do();
    const response = new GetPairResponse({ pairDtos: result });
    return response;
  }
}
