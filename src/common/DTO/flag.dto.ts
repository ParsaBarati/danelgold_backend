import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, ArrayNotEmpty, ArrayMinSize } from "class-validator";

export class FlagDto {
    @ApiProperty({
        type: [Number],
        description: 'Array of course IDs to be flagged',
    })
    @IsArray({ message: 'داده ها باید به صورت آرایه باشند' })
    @ArrayNotEmpty({ message: 'وارد کردن شناسه اجباری می باشد' })
    @ArrayMinSize(1, { message: 'شناسه باید حداقل شامل یک عدد باشد' })
    @IsInt({ each: true, message: 'شناسه را به صورت عدد وارد نمایید' })
    flagItemId: number[];
}
