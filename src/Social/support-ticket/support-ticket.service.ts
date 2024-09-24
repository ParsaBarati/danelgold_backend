import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket } from './entity/support-ticket.entity';

@Injectable()
export class SupportTicketsService {
  constructor(
    @InjectRepository(SupportTicket)
    private ticketsRepository: Repository<SupportTicket>,
  ) {}

  create(ticketData: Partial<SupportTicket>): Promise<SupportTicket> {
    const ticket = this.ticketsRepository.create(ticketData);
    return this.ticketsRepository.save(ticket);
  }

  findAll(): Promise<SupportTicket[]> {
    return this.ticketsRepository.find({ relations: ['user'] });
  }

  findOne(id: number): Promise<SupportTicket> {
    return this.ticketsRepository.findOne({ where: { id }, relations: ['user'] });
  }

  update(id: number, updateData: Partial<SupportTicket>): Promise<any> {
    return this.ticketsRepository.update(id, updateData);
  }

  remove(id: number): Promise<any> {
    return this.ticketsRepository.delete(id);
  }
}
