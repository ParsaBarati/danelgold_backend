import { IsDate, IsOptional, IsString } from "class-validator";


export class UpdateStoryDto{


    @IsOptional()
    @IsString()
    mediaUrl: string;

    @IsOptional()
    @IsDate()
    expiresAt: Date;

}