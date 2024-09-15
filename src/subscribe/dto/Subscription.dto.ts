import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class KeysDto {
  @IsString()
  p256dh: string;

  @IsString()
  auth: string;
} 

export class SubscriptionDto {
  @IsString()
  endpoint: string;

  @IsOptional()
  @IsString()
  expirationTime?: string | null;

  @ValidateNested()
  @Type(() => KeysDto)
  keys: KeysDto;
}

export class SubscribeDto {
  @ValidateNested()
  @Type(() => SubscriptionDto)
  subscription: SubscriptionDto;
}
