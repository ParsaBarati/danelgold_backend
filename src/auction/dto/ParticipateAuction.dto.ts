import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ParticipateAuctionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  bidAmount: number;
}
