import { ApiProperty } from "@nestjs/swagger";
import { 
    IsBoolean, 
    IsDateString, 
    IsEnum, 
    IsInt, 
    IsOptional, 
    IsString 
} from "class-validator";
import { AuctionStatus } from "../entity/auction.entity";


export class UpdateAuctionDto{


    @ApiProperty()
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    startTime?: Date;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    endTime?: Date;

    @ApiProperty()
    @IsInt()
    @IsOptional()
    startingBid?: number;

    @ApiProperty()
    @IsInt()
    @IsOptional()
    currentBid?: number;

    @ApiProperty()
    @IsBoolean()
    isSms?:boolean

    @ApiProperty({ enum: AuctionStatus})
    @IsEnum(AuctionStatus, {})
    @IsOptional()
    auctionStatus?: AuctionStatus;
}