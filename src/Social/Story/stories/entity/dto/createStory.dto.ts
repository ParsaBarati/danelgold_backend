import { IsDate, IsString } from "class-validator";


export class CreateStoryDto{


    @IsString()
    mediaUrl: string;

    @IsDate()
    expiresAt: Date;

}