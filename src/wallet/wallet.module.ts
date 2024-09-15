// src/wallet/wallet.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entity/wallet.entity';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { HttpModule } from '@nestjs/axios';
import { walletTransaction } from './entity/walletTransaction.entity';
import { User } from '@/user/entity/user.entity';
import { TransactionEntity } from '@/transaction/entity/transaction.entity';
import { ZarinpalService } from '@/payment/zarinpal.service';
import { PaginationService } from '@/common/paginate/pagitnate.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Wallet, 
      User, 
      TransactionEntity,  
      walletTransaction
    ]),
    HttpModule,
  ],
  providers: [
    WalletService, 
    ZarinpalService,
    PaginationService
  ],
  controllers: [WalletController],
})
export class WalletModule {}
