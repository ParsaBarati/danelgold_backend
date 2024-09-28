import { IsString } from "class-validator";


export class CreatePostDto{

    @IsString()
    mediaUrl: string;

    @IsString()
    caption: string;
}