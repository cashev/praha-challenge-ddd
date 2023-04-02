import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParticipantController } from './controller/participant/participant.controller';

@Module({
  imports: [],
  controllers: [AppController, ParticipantController],
  providers: [AppService],
})
export class AppModule {}
