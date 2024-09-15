import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TransactionEntity } from './entity/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiResponses, createResponse } from '@/utils/response.util';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}
  
  async getByTransaction(
    transaction: string,
  ): Promise<ApiResponses<TransactionEntity>> {
    const exitingTransaction = await this.transactionRepository.findOneBy({
      transaction: transaction,
    });
    console.log(`exitingTransaction ${JSON.stringify(exitingTransaction)}`);
    if (!exitingTransaction) {
      throw new NotFoundException('این تراکنش وجود ندارد');
    }

    return createResponse(200, exitingTransaction);
  }
}
