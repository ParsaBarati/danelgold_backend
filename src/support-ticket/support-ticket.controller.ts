import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SupportTicket } from './entity/support-ticket.entity';
import { SupportTicketsService } from './support-ticket.service';

@Controller('support-tickets')
export class SupportTicketsController {
  constructor(private readonly supportTicketsService: SupportTicketsService) {}

  @Post()
  create(@Body() createTicketDto: Partial<SupportTicket>) {
    return this.supportTicketsService.create(createTicketDto);
  }

  @Get()
  findAll() {
    return this.supportTicketsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.supportTicketsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateTicketDto: Partial<SupportTicket>) {
    return this.supportTicketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.supportTicketsService.remove(id);
  }
}
