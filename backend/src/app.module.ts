import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParticipantController } from './controller/participant/participant.controller';
import { TeamController } from './controller/team/team.controller';

@Module({
  imports: [],
  controllers: [AppController, ParticipantController, TeamController],
  providers: [AppService],
})
export class AppModule {}
