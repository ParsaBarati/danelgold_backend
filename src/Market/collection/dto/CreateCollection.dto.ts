import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class CreateCollectionDto{

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    text: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    cover: string;
}