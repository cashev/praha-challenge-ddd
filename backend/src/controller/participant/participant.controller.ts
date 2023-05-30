import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { GetAllParticipantUseCase } from 'src/app/get-all-participant-usecase';
import {
  ParticipantNameQS,
  ParticipantQS,
} from 'src/infra/db/query-service/participant-qs';
import { GetParticipantResponse } from './response/participant-response';
import { ParticipantRepository } from 'src/infra/db/repository/participant-repository';
import { TeamRepository } from 'src/infra/db/repository/team-repository';
import { RejoinParticipantUseCase } from 'src/app/rejoin-participant-usecase';
import { SuspendMembershipUsecase } from 'src/app/suspend-membership-usecase';
import { ResignMembershipUsecase } from 'src/app/resign-membership-usecase';
import {
  CreateParticipantRequest,
  ResignParticipantRequest,
  SuspendParticipantRequest,
  RejoinParticipantRequest,
} from './request/participant-request';
import { TaskIdQS } from 'src/infra/db/query-service/task-qs';
import { TaskStatusRepository } from 'src/infra/db/repository/taskStatus-repository';
import { JoinNewParticipantUsecase } from 'src/app/join-new-participant-usecase';
import { NotificationSender } from 'src/infra/notifier/notification-sender';
import { isSome } from 'fp-ts/lib/Option';
import { RemovalTeamMemberValidator } from 'src/app/util/removal-team-member-validator';

@Controller({
  path: '/participant',
})
export class ParticipantController {
  @Get()
  @ApiResponse({ status: 200, type: GetParticipantResponse })
  async getAll(): Promise<GetParticipantResponse> {
    const prisma = new PrismaClient();
    const qs = new ParticipantQS(prisma);
    const usecase = new GetAllParticipantUseCase(qs);
    const result = await usecase.do();
    const response = new GetParticipantResponse({ participantDtos: result });
    return response;
  }

  @Post('create')
  @ApiResponse({ status: 200 })
  async createParticipant(
    @Body()
    request: CreateParticipantRequest,
  ): Promise<void> {
    const prisma = new PrismaClient();
    const participantRepository = new ParticipantRepository(prisma);
    const teamRepository = new TeamRepository(prisma);
    const taskStatusRepository = new TaskStatusRepository(prisma);
    const taskIdQS = new TaskIdQS(prisma);

    const usecase = new JoinNewParticipantUsecase(
      participantRepository,
      teamRepository,
      taskStatusRepository,
      taskIdQS,
    );
    const { name, email } = request;
    const result = await usecase.do(name, email);
    if (isSome(result)) {
      throw new BadRequestException(result.value.message);
    }
  }

  @Post('rejoin')
  @ApiResponse({ status: 200 })
  async rejoinParticipant(
    @Body()
    request: RejoinParticipantRequest,
  ): Promise<void> {
    const prisma = new PrismaClient();
    const teamRepository = new TeamRepository(prisma);

    const usecase = new RejoinParticipantUseCase(teamRepository);
    const result = await usecase.do(request.participantId);
    if (isSome(result)) {
      throw new BadRequestException(result.value.message);
    }
  }

  @Post('suspend')
  @ApiResponse({ status: 200 })
  async suspendParticipant(
    @Body()
    request: SuspendParticipantRequest,
  ): Promise<void> {
    const prisma = new PrismaClient();
    const teamRepository = new TeamRepository(prisma);
    const notificationSender = new NotificationSender();
    const participantNameQS = new ParticipantNameQS(prisma);
    const validator = new RemovalTeamMemberValidator(
      teamRepository,
      notificationSender,
      participantNameQS,
    );

    const usecase = new SuspendMembershipUsecase(teamRepository, validator);
    const result = await usecase.do(request.participantId);
    if (isSome(result)) {
      throw new BadRequestException(result.value.message);
    }
  }

  @Post('resign')
  @ApiResponse({ status: 200 })
  async resignParticipant(
    @Body()
    request: ResignParticipantRequest,
  ): Promise<void> {
    const prisma = new PrismaClient();
    const teamRepository = new TeamRepository(prisma);
    const notificationSender = new NotificationSender();
    const participantNameQS = new ParticipantNameQS(prisma);
    const validator = new RemovalTeamMemberValidator(
      teamRepository,
      notificationSender,
      participantNameQS,
    );

    const usecase = new ResignMembershipUsecase(teamRepository, validator);
    const result = await usecase.do(request.participantId);
    if (isSome(result)) {
      throw new BadRequestException(result.value.message);
    }
  }
}
