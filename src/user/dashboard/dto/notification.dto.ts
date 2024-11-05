// notification.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class SendNotificationDto {
    @IsNotEmpty()
    @IsString()
    readonly userId: string;

    @IsNotEmpty()
    @IsString()
    readonly title: string;

}
