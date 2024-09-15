import { HttpStatus } from '@nestjs/common';
import { Wallet } from '@/wallet/entity/wallet.entity';

export interface IIncrease {
  result?: Wallet;
  statusCode: HttpStatus;
  message?: string;
}
