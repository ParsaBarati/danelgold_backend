import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ParticipateAuctionDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  bidAmount: number;
}
