import { GatewayPay } from '@/order/entity/order.entity';
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseEnumPipe implements PipeTransform<string, GatewayPay> {
  constructor(private readonly enumType: any) {}

  transform(value: string): GatewayPay {
    const enumValues = Object.values(this.enumType);

    if (!enumValues.includes(value)) {
      throw new BadRequestException(
        `${value} is not a valid enum value for ${this.enumType}`,
      );
    }

    return value as GatewayPay;
  }
}
