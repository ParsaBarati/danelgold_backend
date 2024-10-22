import { IsArray, IsDate, IsOptional, IsString } from "class-validator";


export class UpdateStoryDto{


    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    mediaUrl?: string[];

    @IsOptional()
    @IsDate()
    expiresAt: Date;

}