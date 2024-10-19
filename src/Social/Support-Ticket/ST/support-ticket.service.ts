import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket, TicketStatus } from './entity/support-ticket.entity';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { CreateSTDto } from './dto/createST.dto';
import { User } from '@/User/user/entity/user.entity';
import { UpdateSTDto } from './dto/updateST.dto';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectRepository(SupportTicket)
    private ticketsRepository: Repository<SupportTicket>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createST(
    userIdentifier: string,
    creatSTDto: CreateSTDto
  ):Promise<ApiResponses<SupportTicket>>{

    const { title, description } = creatSTDto;

    const user = await this.userRepository.findOne({
      where: [{ phone: userIdentifier }, { email: userIdentifier }]
    })

    if(!user){
      throw new NotFoundException('کاربر یافت نشد')
    }

    const ST = {
      title,
      description,
      user,
      createdAt : new Date()
    }

    const savedST = await this.ticketsRepository.save(ST);

    return createResponse(201,savedST);
  }

  async updateST(
    stId: number,
    currentUserIdentifier: string,
    updateSTDto: UpdateSTDto
  ):Promise<ApiResponses<SupportTicket>>{

    const ST = await this.ticketsRepository.findOneBy({ id: stId });

    if(!ST){
      throw new NotFoundException('تیکت پشتیبانی یافت نشد')
    }

    if(ST.userIdentifier !== currentUserIdentifier){
      throw new UnauthorizedException('شما مجاز به ویرایش نیستید')
    }

    if(ST.status !== TicketStatus.OPEN){
      throw new BadRequestException('تیکت هایی که در حالت باز نیستند،قابل ویرایش نیستند')
    }

    ST.title = updateSTDto.title
    ST.description = updateSTDto.description

    ST.updatedAt = new Date ();

    const updatedST = await this.ticketsRepository.save(ST);

    return createResponse(200,updatedST);
  }

  async removeST(
    stId: number,
    currentUserIdentifier: string
  ):Promise<{ message: string }>{

    const ST = await this.ticketsRepository.findOneBy({ id: stId });

    if(!ST){
      throw new NotFoundException('تیکت یافت نشد')
    }

    if(ST.userIdentifier !== currentUserIdentifier){
      throw new UnauthorizedException('شما مجاز به حذف نیستید')
    }

    if(ST.status !== TicketStatus.OPEN){
      throw new BadRequestException('تیکت هایی که در حالت باز نیستند،قابل حذف نیستند')
    }

    await this.ticketsRepository.remove(ST);

    return { message: 'تیکت حذف شد' }
  }

  async closeST(
    stId: number
  ):Promise<{ message: string}>{

    const openST = await this.ticketsRepository.findOne({
      where: { 
        id: stId, 
        status: TicketStatus.OPEN || TicketStatus.IN_PROGRESS
      }
    })

    if(!openST){
      throw new NotFoundException('تیکت یافت نشد و یا در حالت بسته قرار دارد')
    }

    openST.status = TicketStatus.CLOSED;

    await this.ticketsRepository.save(openST);

    return { message: 'تیکت بسته شد' }
  }
}
