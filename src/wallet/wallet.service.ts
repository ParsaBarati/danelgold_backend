import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entity/wallet.entity';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { walletTransaction } from './entity/walletTransaction.entity';
import { User } from '@/user/entity/user.entity';
import { TransactionEntity, TransactionStatus } from '@/transaction/entity/transaction.entity';
import { ZarinpalService } from '@/payment/zarinpal.service';
import { PaginationResult, PaginationService } from '@/common/paginate/pagitnate.service';
import { ApiResponses, createResponse } from '@/utils/response.util';
@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(walletTransaction)
    private readonly walletTransactionRepository: Repository<walletTransaction>,
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,

    private readonly zarinpalService: ZarinpalService,
    private readonly paginationService: PaginationService,
  ) {}

  async getBalance(
    userPhone: string,
  ): Promise<{ result: number; statusCode: HttpStatus }> {
    const wallet = await this.walletRepository.findOne({
      where: { userPhone },
    });
    const walletResult = wallet ? wallet.balance : 0;
    return { result: walletResult, statusCode: HttpStatus.OK };
  }

  async increaseBalance(
    userPhone: string, 
    amount: number
  ): Promise<{ message: string; statusCode: HttpStatus }> {

    let wallet = await this.walletRepository.findOne({ where: { userPhone } });
    if (!wallet) {
      wallet = this.walletRepository.create({ userPhone, balance: 0 });
    }
  
    wallet.balance += amount;
    await this.walletRepository.save(wallet);
  
    const walletTransactionInstance = new walletTransaction(); 
    walletTransactionInstance.transaction = uuidv4().replace(/-/g, '').slice(0, 16);
    walletTransactionInstance.amount = amount;
    walletTransactionInstance.wallet = wallet;
    await this.walletTransactionRepository.save(walletTransactionInstance);
  
    return { message: 'با موفقیت اضافه شد', statusCode: 201 };
  }
  
  async decreaseBalance(
    userPhone: string, 
    amount: number,
    orderId?: number
  ): Promise<{ message: string; statusCode: HttpStatus }> {

    const wallet = await this.walletRepository.findOne({ where: { userPhone } });
    if (!wallet || wallet.balance < amount) {
        throw new BadRequestException('محاسبات نباید منفی شود');
    }

    wallet.balance -= amount;
    await this.walletRepository.save(wallet);

    const walletTransactionInstance = new walletTransaction(); 
    walletTransactionInstance.transaction = uuidv4().replace(/-/g, '').slice(0, 16);
    walletTransactionInstance.amount = -amount;
    walletTransactionInstance.wallet = wallet;

    if (orderId) {
        walletTransactionInstance.orderId = orderId; 
    }

    await this.walletTransactionRepository.save(walletTransactionInstance);

    return { message: 'با موفقیت کسر شد', statusCode: 201 };
  }

  async chargeWallet(
    userPhone: string,
    amount: number,
  ): Promise<{ url: string; authority: string; transactionId: string }> {
    const user = await this.userRepository.findOne({
      where: { phone: userPhone },
    });

    if (!user) {
      throw new NotFoundException('کاربر وجود ندارد');
    }

    let wallet = await this.walletRepository.findOne({ where: { userPhone } });
    if (!wallet) {
      wallet = this.walletRepository.create({ userPhone, balance: 0, user });
      await this.walletRepository.save(wallet);
    }

    const transactionId = uuidv4().replace(/-/g, '').slice(0, 16);

    const { url, authority } = await this.zarinpalService.createPaymentRequest(
      amount,
      transactionId,
      'wallet',
    );

    const transaction = new TransactionEntity();
    transaction.transaction = transactionId;
    transaction.isOpen = true;
    transaction.status = TransactionStatus.Pending;
    transaction.authority = authority;
    transaction.amount = amount;
    transaction.wallet = wallet;
    await this.transactionRepository.save(transaction);

    return { url, authority, transactionId };
  }

  async verifyPayment(transaction: string, status: string, res: Response) {
    const transactionEntity = await this.transactionRepository.findOne({
      where: { transaction },
      relations: ['wallet'],
    });

    if (!transactionEntity) {
      throw new NotFoundException('تراکنش یافت نشد');
    }

    const wallet = transactionEntity.wallet;
    if (!wallet) {
      throw new NotFoundException('کیف پول یافت نشد');
    }

    const verificationResult = await this.zarinpalService.verifyPayment(
      transactionEntity.amount,
      transactionEntity.authority,
    );

    console.log(`verificationResult >>> ${JSON.stringify(verificationResult)}`);

    transactionEntity.isOpen = false;

    if (verificationResult.code === 100 || status === 'OK') {
      transactionEntity.status = TransactionStatus.Success;
      transactionEntity.refId = verificationResult.ref_id;
      await this.transactionRepository.save(transactionEntity);

      wallet.balance = +wallet.balance + +transactionEntity.amount;
      await this.walletRepository.save(wallet);

      return res.redirect(`${process.env.VERIFY_URL}${transaction}`);
    } else if (status === 'NOK') {
      
      transactionEntity.status = TransactionStatus.Cancelled;
      await this.transactionRepository.save(transactionEntity);

      return res.redirect(`${process.env.VERIFY_URL}${transaction}`);
    }
  }

  async getAllWallets(
    query: any,
  ): Promise<ApiResponses<PaginationResult<any>>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'id',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.walletRepository
      .createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .select([
        'wallet.id',
        'wallet.balance',
        'wallet.createdAt',
        'wallet.updatedAt',
        'wallet.userPhone',
        'user.firstName',
        'user.lastName',
      ])
      .orderBy(`wallet.${sort}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const paginationResult = await this.paginationService.paginate(
      queryBuilder,
      page,
      limit,
    );

    if (search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR wallet.userPhone ILIKE :search)',
        { search: `%${search}%` },
      );

      return createResponse(200, paginationResult);
    }

    return createResponse(200, paginationResult);
  }
  
  async getAllWalletOrders(
    query: any,
  ): Promise<ApiResponses<PaginationResult<any>>> {
    const {
      page = 1,
      limit = 10,
      search,
      sort = 'id',
      sortOrder = 'DESC',
    } = query;


    const queryBuilder = await this.walletTransactionRepository
      .createQueryBuilder('wallet_transactions')
      .leftJoinAndSelect('wallet_transactions.wallet','wallet')
      .leftJoinAndSelect('wallet.user','user')
      .orderBy(`wallet_transactions.${sort}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

      if (search) {
        queryBuilder.andWhere(
          '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR wallet.userPhone ILIKE :search)',
          { search: `%${search}%` },
        );
      }
  
      const paginationResult = await this.paginationService.paginate(
        queryBuilder,
        page,
        limit,
      );
    return createResponse(200, paginationResult);
  }
  
  async getWalletOrdersByUser(
    phone: string,
    query:any
  ): Promise<ApiResponses<PaginationResult<any>>>{

    const {
      page = 1,
      limit = 10,
      sort = 'id',
      sortOrder = 'DESC',
    } = query;

    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const wallet = await this.walletTransactionRepository
      .createQueryBuilder('wallet_transactions')
      .leftJoinAndSelect('wallet_transactions.wallet','wallet')
      .select([
        'wallet_transactions.id',
        'wallet_transactions.amount',
        'wallet_transactions.createdAt',
        'wallet_transactions.orderId',
      ])
      .where('wallet.userPhone = :phone', { phone })
      .orderBy(`wallet_transactions.${sort}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);
  
      const paginationResult = await this.paginationService.paginate(
        wallet,
        page,
        limit,
      );
    return createResponse(200, paginationResult);
  }
  

}
