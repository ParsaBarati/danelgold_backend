import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";


export class AddUserDto {
    @IsString()
    name: string;

    @IsString()
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;
}