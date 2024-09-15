import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entity/transaction.entity';
import { Module } from '@nestjs/common';
import { TransactionConroller } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  controllers: [TransactionConroller],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
