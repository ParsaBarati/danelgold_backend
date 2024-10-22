import { ArrayNotEmpty, IsArray, IsDate, IsOptional, IsString } from "class-validator";


export class CreateStoryDto{


    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    mediaUrl: string[];

    @IsDate()
    @IsOptional()
    expiresAt?: Date;

}