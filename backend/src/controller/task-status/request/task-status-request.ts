import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class PostTaskStatusRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly taskIds: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['在籍中', 'レビュー待ち', '完了'])
  readonly status: string;

  @ApiProperty()
  @IsNumber()
  readonly page: number;
}
