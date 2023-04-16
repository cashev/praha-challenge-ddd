import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class PatchParticipantRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly participantId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['在籍中', 'レビュー待ち', '完了'])
  readonly status: string;
}
