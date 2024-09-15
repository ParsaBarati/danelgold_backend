import { Module } from '@nestjs/common';
import { ZarinpalService } from './zarinpal.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ZarinpalService],
  exports: [ZarinpalService],
})
export class PaymentModule {}
