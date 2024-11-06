import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBlogPostDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    verticalCover: string;

    @ApiProperty()
    @IsString()
    horizontalCover: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty()
    @IsString()
    subTitle: string;

    @ApiProperty()
    authorId: number;

    @ApiProperty()
    categoryId: number;
}
