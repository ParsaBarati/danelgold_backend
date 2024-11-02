import { IsString } from "class-validator";


export class CreateTopicDto{

    @IsString()
    title: string;

    @IsString()
    content: string;
}