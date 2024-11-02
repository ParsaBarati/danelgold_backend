import { IsOptional, IsString } from "class-validator";


export class UpdatePostDto{

    @IsString()
    @IsOptional()
    mediaUrl: string;

    @IsString()
    @IsOptional()
    caption: string;
}