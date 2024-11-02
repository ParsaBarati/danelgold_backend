import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";


export class CreateCommentDTO {

    @ApiProperty()
    @IsNotEmpty({message: 'Comment cannot be empty'})
    @IsString()
    content: string

    @ApiProperty()
    @IsOptional()
    @IsNumber({}, {message: 'چه امتیازی به این دوره می دهید؟'})
    @IsIn([1, 2, 3, 4, 5, null], {message: 'چه امتیازی به این دوره می دهید؟'})
    rating: number

    @ApiProperty()
    @IsOptional()
    @IsBoolean({message: 'آیا این دوره را به دیگران توصیه می کنید؟'})
    suggestion: boolean | null
}