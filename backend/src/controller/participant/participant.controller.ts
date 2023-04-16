import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetAllParticipantUseCase } from 'src/app/get-all-participant-usecase';
import { ParticipantQS } from 'src/infra/db/query-service/participant-qs';
import { GetParticipantResponse } from './response/participant-response';
import { ParticipantRepository } from 'src/infra/db/repository/participant-repository';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import {
  Kyukai,
  Taikai,
  Zaiseki,
  createUserStatus,
} from 'src/domain/value-object/participantStatus';
import { RejoinTeamUseCase } from 'src/app/rejoin-team-usecase';
import { SuspendMembershipUsecase } from 'src/app/suspend-membership-usecase';
import { ResignMembershipUsecase } from 'src/app/resign-membership-usecase';
import {
  PatchParticipantRequest,
  PostParticipantRequest,
} from './request/participant-request';
import { TaskQS } from 'src/infra/db/query-service/task-qs';
import { TaskStatusRepository } from 'src/infra/db/repository/taskStatus-repository';
import { JoinNewParticipantUsecase } from 'src/app/join-new-participant-usecase';

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

  @Post()
  @ApiResponse({ status: 200 })
  async createParticipant(
    @Body()
    postParticipantRequest: PostParticipantRequest,
  ): Promise<void> {
    const prisma = new PrismaClient();
    const participantRepository = new ParticipantRepository(prisma);
    const teamRepository = new TeamRepository(prisma);
    const taskStatusRepository = new TaskStatusRepository(prisma);
    const taskQS = new TaskQS(prisma);

    const usecase = new JoinNewParticipantUsecase(
      participantRepository,
      teamRepository,
      taskStatusRepository,
      taskQS,
    );
    const { name, email } = postParticipantRequest;
    await usecase.do(name, email);
  }

  @Patch()
  @ApiResponse({ status: 200 })
  async changeParticipantStatus(
    @Body()
    patchParticipantRequest: PatchParticipantRequest,
  ): Promise<void> {
    const prisma = new PrismaClient();
    const participantRepository = new ParticipantRepository(prisma);
    const teamRepository = new TeamRepository(prisma);

    const { participantId, status } = patchParticipantRequest;
    switch (createUserStatus(status)) {
      case Zaiseki:
        await new RejoinTeamUseCase(participantRepository, teamRepository).do(
          participantId,
        );
        break;
      case Kyukai:
        await new SuspendMembershipUsecase(
          participantRepository,
          teamRepository,
        ).do(participantId);
        break;
      case Taikai:
        await new ResignMembershipUsecase(
          participantRepository,
          teamRepository,
        ).do(participantId);
        break;
    }
  }
}
