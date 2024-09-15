import { Controller, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionConroller {
  constructor(private readonly transactionService: TransactionService) {}
  @Get(':transaction')
  async getByTransaction(
    @Param('transaction') transaction: string
  ){
    return this.transactionService.getByTransaction(transaction);
  }
}
