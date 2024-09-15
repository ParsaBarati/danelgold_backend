import { WalletService } from './wallet.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { 
  Body, 
  Controller, 
  DefaultValuePipe, 
  Get, 
  Param, 
  ParseIntPipe, 
  Post, 
  Query, 
  Req, 
  Res 
} from '@nestjs/common';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/user/entity/user.entity';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Wallet')
@ApiBearerAuth()
@Controller('')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('/wallet/balance')
  async getBalance(@Req() req: Request) {
    const userPhone = (req.user as any).result.phone;
    return this.walletService.getBalance(userPhone);
  }

  @Roles(UserRole.ADMIN)
  @Post('/wallet/increase')
  async increaseBalance(
    @Body('userPhone') userPhone: string,
    @Body('amount') amount: number,
  ) {
    return await this.walletService.increaseBalance(userPhone, amount);
  }

  @Roles(UserRole.ADMIN)
  @Post('/wallet/decrease')
  async decreaseBalance(
    @Body('userPhone') userPhone: string,
    @Body('amount') amount: number,
  ) {
    return await this.walletService.decreaseBalance(userPhone, amount);
  }

  @Post('/wallet/charge')
  async chargeWallet(
    @Body('amount') amount: number, 
    @Req() req: Request
  ){
    const userPhone = (req.user as any).result.phone;
    return this.walletService.chargeWallet(userPhone, amount);
  }

  @Public()
  @Get('verify/wallet')
  async verifyWalletPayment(
    @Query('transaction') transactionId: string,
    @Query('Status') status: string,
    @Res() res: Response,
  ) {
    return this.walletService.verifyPayment(transactionId, status, res);
  }

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @Get('/wallet/all')
  async getAllCourses(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('sortBy') sort?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const query = { page, limit, search, sort, sortOrder };
    return await this.walletService.getAllWallets(query);
  }

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @Get('/wallet/allOrder')
  async getAllWalletTransactions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('sortBy') sort?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const query = { page, limit, search, sort, sortOrder };
    return this.walletService.getAllWalletOrders(query);
  }

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @Get('wallet/order/:phone')
  async getWalletTransactionsByUser(
    @Param('phone') phone: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy') sort?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ){
    const query = { page, limit, sort, sortOrder };
    return this.walletService.getWalletOrdersByUser(phone,query);
  }

}
