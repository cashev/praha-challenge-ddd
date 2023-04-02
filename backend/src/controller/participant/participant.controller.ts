import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetAllParticipantUseCase } from 'src/app/get-all-participant-usecase';
import { ParticipantQS } from 'src/infra/db/query-service/participant-qs';
import { GetParticipantResponse } from './response/participant-response';

@Controller({
  path: '/participant',
})
export class ParticipantController {
  @Get()
  @ApiResponse({ status: 200, type: GetParticipantResponse })
  async getAllParticipant(): Promise<GetParticipantResponse> {
    const prisma = new PrismaClient();
    const qs = new ParticipantQS(prisma);
    const usecase = new GetAllParticipantUseCase(qs);
    const result = await usecase.do();
    const response = new GetParticipantResponse({ participantDtos: result });
    return response;
  }
}
