import { IsString } from 'class-validator';

// create-notification.dto.ts
export class CreateNotificationDto {
  @IsString()
  title: string;
  @IsString()
  content: string;
}
