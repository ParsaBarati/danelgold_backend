import { IsDate, IsOptional, IsString } from "class-validator";


export class CreateStoryDto{


    @IsString()
    mediaUrl: string;

    @IsDate()
    @IsOptional()
    expiresAt?: Date;

}