import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsInt, IsString } from "class-validator";


export class CreateAuctionDto{


    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsDateString()
    startTime: Date;

    @ApiProperty()
    @IsDateString()
    endTime: Date;

    @ApiProperty()
    @IsInt()
    startingBid: number;

    @ApiProperty()
    @IsInt()
    currentBid: number;

    @ApiProperty()
    @IsBoolean()
    isSms:boolean
}