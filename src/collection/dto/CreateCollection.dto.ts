import { IsOptional, IsString } from "class-validator";


export class CreateCollectionDto{

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description: string;
}