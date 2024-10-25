import {ArrayNotEmpty, IsArray, IsString} from "class-validator";


export class CreatePostDto{

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    mediaUrl: string[];

    @IsString()
    caption: string;
}