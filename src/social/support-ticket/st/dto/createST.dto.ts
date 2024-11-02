import { IsString } from "class-validator";


export class CreateSTDto{

    @IsString()
    title: string;

    @IsString()
    description: string;
    
}