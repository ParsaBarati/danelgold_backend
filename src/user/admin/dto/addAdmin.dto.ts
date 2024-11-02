import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";


export class AddAdminDto {
    @IsString()
    name: string;

    @IsString()
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEmail()
    email: string;

}