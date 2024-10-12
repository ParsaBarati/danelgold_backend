import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class UpdateCollectionDto{

    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    text?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    cover?: string;
}