import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { User } from '@/User/user/entity/user.entity';
import { Auction, AuctionStatus } from '@/Market/auction/entity/auction.entity';
import { CreateAuctionDto } from '@/Market/auction/dto/CreateAuction.dto';
import { UpdateAuctionDto } from '@/Market/auction/dto/UpdateAuction.dto';
import { ParticipateAuctionDto } from '@/Market/auction/dto/ParticipateAuction.dto';
import { Bid } from './entity/auctionBid.entity';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { PaginationResult, PaginationService } from '@/common/paginate/pagitnate.service';
import { CronJob } from 'cron';

@Injectable()
export class AuctionsService {
  private job: CronJob;
  constructor(
    @InjectRepository(Auction)
    private readonly auctionsRepository: Repository<Auction>,
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly paginationService: PaginationService,
  ) {}

  async createAuction(
    creatorPhone: string,
    createAuctionDto:CreateAuctionDto
  ): Promise<ApiResponses<Auction>> {

    const {
      title, 
      startTime, 
      endTime, 
      startingBid, 
      currentBid,
      isSms
     } = createAuctionDto;

     const creator = await this.userRepository.findOne({ where: { phone:creatorPhone } });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    let highestBidder = null;
    
    if (highestBidder) {
    highestBidder = await this.userRepository.findOne({ where: { phone: highestBidder} });
    if (!highestBidder) {
      throw new NotFoundException('Highest bidder not found');
    }
    }

     if (endTime && startTime && endTime < startTime) {
      throw new BadRequestException(
        'تاریخ پایان مزایده نمی تواند زودتر از تاریخ شروع آن باشد',
      );
    }

    const auction = {
      title,
      startTime,
      endTime,
      creator: creator,
      creatorPhone: creator.phone ,
      highestBidderPhone: highestBidder ? highestBidder.phone : null,
      startingBid,
      currentBid,
      isSms: isSms,
      auctionStatus: AuctionStatus.Active,
      createdAt : new Date(),
    }
    const savedAuction = await this.auctionsRepository.save(auction);

    return createResponse(201,savedAuction)
  }

  async updateAuction(
    auctionId: number, 
    updateAuctionDto: UpdateAuctionDto
  ): Promise<ApiResponses<Auction>> {

    const {
      title,
      startTime,
      endTime,
      startingBid,
      currentBid,
      isSms,
      auctionStatus
    } = updateAuctionDto
    
    const existingAuction = await this.auctionsRepository.findOne({
      where: { id:auctionId }
    });

    if (!existingAuction) {
      throw new NotFoundException('مزایده مورد نظر پیدا نشد');
    }

    existingAuction.title = title ?? existingAuction.title
    existingAuction.startTime = startTime ?? existingAuction.startTime
    existingAuction.endTime = endTime ?? existingAuction.endTime
    existingAuction.startingBid = startingBid ?? existingAuction.startingBid
    existingAuction.currentBid = currentBid ?? existingAuction.currentBid
    existingAuction.isSms = isSms ?? existingAuction.isSms
    existingAuction.auctionStatus = auctionStatus ?? existingAuction.auctionStatus


    const updatedAuction = await this.auctionsRepository.save(existingAuction)

    return createResponse(200,updatedAuction)

  }

  async deleteAuction(
    auctionId: number
  ): Promise<{message: string}> {

    const auction = await this.auctionsRepository.findOne({
      where: {id: auctionId}
    })

    if(!auction){
      throw new NotFoundException('مزایده یافت نشد')
    }

    if(auction.auctionStatus === AuctionStatus.Active) {
      throw new BadRequestException('مزایده فعال قابل حذف نیست')
    }

    await this.auctionsRepository.remove(auction);

    return{ message : 'مزایده با موفقیت حذف گردید'}
  }

  async getAllAuctions(
    query: any
  ): Promise<ApiResponses<PaginationResult<any>>> {

    const {
      page = 1,
      limit = 10,
      search,
      sort = 'id',
      sortOrder = 'DESC',
    } = query;

    const queryBuilder = this.auctionsRepository
      .createQueryBuilder('auctions')
      .select([
        'auctions.id',
        'auctions.title',
        'auctions.startTime',
        'auctions.endTime',
        'auctions.startingBid',
        'auctions.currentBid',
        'auctions.auctionStatus',
        'auctions.createdAt',
        'auctions.updatedAt'
      ])
      .orderBy(`auctions.${sort}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

      const paginationResult = await this.paginationService.paginate(
        queryBuilder,
        page,
        limit,
      );

      if(search){
        queryBuilder.andWhere('(auctions.title ILIKE :search)', 
          {search: `%${search}%`} 
        )
      }

      return createResponse(200,paginationResult);
      
  }

  async getAuctionById(
    auctionId: number
  ): Promise<ApiResponses<any>> {
    
    const auction = await this.auctionsRepository.findOne({
       where: { id:auctionId }, 
       relations: ['nfts'] 
      });

    if(!auction){
      throw new NotFoundException('مزایده یافت نشد')
    }
    
    const existingAuction = await this.auctionsRepository
      .createQueryBuilder('auctions')
      .leftJoinAndSelect('auctions.nfts','nft')
      .leftJoinAndSelect('nfts.user','user')
      .select([
        'auctions.id',
        'auctions.title',
        'auctions.startTime',
        'auctions.endTime',
        'auctions.startingBid',
        'auctions.currentBid',
        'auctions.auctionStatus',
        'auctions.createdAt',
        'auctions.updatedAt'
      ])
      .addSelect([
        'nft.id',
        'nft.name',
        'nft.description',
        'nft.image',
        'nft.matadataUrl',
        'nft.ownerPhone',
        'nft.creatorPhone',
        'nft.price',
        'nft.createdAt',
        'nft.updatedAt'
      ])
      .addSelect([
        'user.firstName',
        'user.lastName',
      ])
      .where('auctions.id = :auctionId', { auctionId })

      return createResponse(200,existingAuction)
  }

  async participateAuction(
    auctionId: number,
    participateAuctionDto: ParticipateAuctionDto,
    userPhone: string
  ): Promise<{ message: string }> {
    const { bidAmount } = participateAuctionDto;

    const auction = await this.auctionsRepository.findOne({
      where: { id: auctionId },
      relations: ['bids'],
    });

    if (!auction) {
      throw new NotFoundException('مزایده یافت نشد'); 
    }

    if (auction.auctionStatus === AuctionStatus.Deactive) {
      throw new BadRequestException('مزایده به پایان رسیده است'); 
    }

    if (bidAmount <= (auction.currentBid || 0)) {
      throw new BadRequestException('مقدار پیشنهاد باید بیشتر از پیشنهاد فعلی باشد'); 
    }

    const user = await this.userRepository.findOne({ where: { phone: userPhone } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const newBid = this.bidRepository.create({
      amount: bidAmount,
      auction,
      user,
      createdAt: new Date(),
    });

    await this.bidRepository.save(newBid);

    auction.currentBid = bidAmount;
    auction.highestBidder = user; 

    await this.auctionsRepository.save(auction);

    return { message: 'پیشنهاد با موفقیت ثبت شد' }; 
  }

  async checkAuctionDate():Promise<any>{

    const activeAuctions = await this.auctionsRepository.find({
      where:{
        endTime: LessThan(new Date()),
        auctionStatus: AuctionStatus.Active
      }
    });

    if(activeAuctions.length > 0) {
      for (const activeAuction of activeAuctions) {
        activeAuction.auctionStatus = AuctionStatus.Deactive
      } 
      await this.auctionsRepository.save(activeAuctions)
    }

    return {
      statusCode: 200,
      message: 'active auctions dueDate checked and deactive'
    }
  }

  onModuleInit() {
    this.job = new CronJob('* * * * *', async () => {
      await this.checkAuctionDate();
      console.log('Cron job for deactivating auctions ran.');
    });
    this.job.start();
  }
  
  onModuleDestroy() {
    if (this.job) {
      this.job.stop();
    }
  }

}
