import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateReplyDTO {
  @ApiProperty()
  @IsString({ message: 'این دیدگاه را با زبان شیرین فارسی پاسخ دهید' })
  content: string;

  @ApiProperty()
  @IsInt({ message: 'آیدی کامنت صحیح نیست' })
  @IsOptional()
  parentCommentId?: number;

  @ApiProperty()
  @IsInt({ message: 'آیدی ریپلای صحیح نیست' })
  @IsOptional()
  parentReplyId?: number;
}

