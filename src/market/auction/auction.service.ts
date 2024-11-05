import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { User } from '@/user/user/entity/user.entity';
import { Auction, AuctionStatus } from '@/market/auction/entity/auction.entity';
import { CreateAuctionDto } from '@/market/auction/dto/CreateAuction.dto';
import { UpdateAuctionDto } from '@/market/auction/dto/UpdateAuction.dto';
import { ParticipateAuctionDto } from '@/market/auction/dto/ParticipateAuction.dto';
import { Bid } from './entity/auctionBid.entity';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { PaginationResult, PaginationService } from '@/common/paginate/pagitnate.service';
import { CronJob } from 'cron';
import { AuctionsResponseDto, CurrentAuctionDto, UpcomingAuctionDto } from './dto/filter-auction.dto';

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
    creatorIdentifier: string,
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

    const creator = await this.userRepository.findOne({ 
      where: [{ phone: creatorIdentifier },{ email: creatorIdentifier }] 
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    let highestBidder = null;
    
    if (highestBidder) {

    highestBidder = await this.userRepository.findOne({ 
      where: [{ phone: highestBidder },{ email: highestBidder} ] 
    });

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
      highestBidderIdentifier: highestBidder ? highestBidder : null,
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

  async getAuctions(): Promise<AuctionsResponseDto> {
    // Fetch the current auction
    const currentAuction = await this.auctionsRepository
        .createQueryBuilder('auction')
        .leftJoinAndSelect('auction.items', 'item')
        .where('auction.isActive = true') // Assuming you have an 'isActive' flag
        .getOne();

    // Fetch upcoming auctions
    const upcomingAuctions = await this.auctionsRepository
        .createQueryBuilder('auction')
        .leftJoinAndSelect('auction.items', 'item')
        .where('auction.startDate > NOW()') // Assuming you want auctions that start in the future
        .orderBy('auction.startDate', 'ASC')
        .getMany();

       // Map results to the response DTO structure
        const currentAuctionDto: CurrentAuctionDto = currentAuction
        ? {
        id: currentAuction.id,
        title: currentAuction.title,
        startDate: currentAuction.startTime,
        endDate: currentAuction.endTime,
        items: {
            id: currentAuction.items.id,  // Access the related NFT directly
            name: currentAuction.items.name,
            artist: {
                id: currentAuction.items.artist.id,
                name: currentAuction.items.artist.name,
            },
        },
      }
      : null;


      const upcomingAuctionsDto: UpcomingAuctionDto[] = upcomingAuctions.map(auction => ({
        id: auction.id,
        title: auction.title,
        startDate: auction.startTime,
        item: {
            id: auction.items.id,
            name: auction.items.name,
            artist: {
                id: auction.items.artist.id,
                name: auction.items.artist.name,
            },
            startingBid: auction.startingBid, // Optional starting bid
        },
    }));

    return {
        currentAuction: currentAuctionDto,
        upcomingAuctions: upcomingAuctionsDto,
    };
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
        'nft.ownerIdentifier',
        'nft.creatorIdentifier',
        'nft.price',
        'nft.createdAt',
        'nft.updatedAt'
      ])
      .addSelect([
        'user.username',
      ])
      .where('auctions.id = :auctionId', { auctionId })

      return createResponse(200,existingAuction)
  }

  async participateAuction(
    auctionId: number,
    participateAuctionDto: ParticipateAuctionDto,
    userIdentifier : string
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

    const user = await this.userRepository.findOne({ 
      where: [{ phone: userIdentifier }, { email: userIdentifier }]
     });

    if (!user) {
      throw new NotFoundException('User not found');
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
