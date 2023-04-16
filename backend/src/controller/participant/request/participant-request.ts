import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class PostParticipantRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

export class PatchParticipantRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly participantId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['在籍中', 'レビュー待ち', '完了'])
  readonly status: string;
}
