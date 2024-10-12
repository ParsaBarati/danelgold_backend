import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";


export class UpdateNFTDto{

    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    text?: string;

    @ApiProperty()
    @IsInt()
    @IsOptional()
    price?: number;
}