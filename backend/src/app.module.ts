import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParticipantController } from './controller/participant/participant.controller';
import { TeamController } from './controller/team/team.controller';
import { TaskController } from './controller/task/task.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    ParticipantController,
    TeamController,
    TaskController,
  ],
  providers: [AppService],
})
export class AppModule {}
