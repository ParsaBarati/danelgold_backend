import { IsOptional, IsString } from "class-validator";


export class UpdateSTDto{

    @IsOptional()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description: string;
    
}