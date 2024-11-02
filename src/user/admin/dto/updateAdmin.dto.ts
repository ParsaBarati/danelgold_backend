import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";


export class UpdateAdminDto {

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

}