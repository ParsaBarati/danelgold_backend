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
    description?: string;
}