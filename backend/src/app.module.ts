import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParticipantController } from './controller/participant/participant.controller';
import { TeamController } from './controller/team/team.controller';
import { TaskController } from './controller/task/task.controller';
import { TaskStatusController } from './controller/task-status/task-status.controller';
import { PairController } from './controller/pair/pair-controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    ParticipantController,
    PairController,
    TeamController,
    TaskController,
    TaskStatusController,
  ],
  providers: [AppService],
})
export class AppModule {}
