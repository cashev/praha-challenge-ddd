import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateParticipantRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

export class RejoinParticipantRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly participantId: string;
}

export class SuspendParticipantRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly participantId: string;
}

export class ResignParticipantRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly participantId: string;
}
