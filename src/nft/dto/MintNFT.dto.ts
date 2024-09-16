import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";


export class MintNFTDto{

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    imageURL: string;

    @ApiProperty()
    @IsInt()
    price: number;
}