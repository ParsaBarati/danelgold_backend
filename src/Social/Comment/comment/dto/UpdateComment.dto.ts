import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Matches } from "class-validator";


export class UpdateCommentDTO{
    
    @ApiProperty()
    @IsOptional({ message: 'دیدگاه شما برای ما بسیار ارزشمند است' })
    @IsString()
    content:string

    @ApiProperty()
    @IsOptional()
    @IsNumber({},{message:'چه امتیازی به این دوره می دهید؟'})
    @IsIn([1,2,3,4,5,null],{message:'چه امتیازی به این دوره می دهید؟'})
    rating:number

    @ApiProperty()
    @IsOptional()
    @IsBoolean({message:'آیا این دوره را به دیگران توصیه می کنید؟'})
    suggestion:boolean | null
}