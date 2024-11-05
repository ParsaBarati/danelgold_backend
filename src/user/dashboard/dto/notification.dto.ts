// notification.dto.ts
import {IsInt, IsNotEmpty, IsString} from 'class-validator';

export class SendNotificationDto {
    @IsNotEmpty()
    @IsInt()
    readonly userId: number;

    @IsNotEmpty()
    @IsString()
    readonly title: string;

}
