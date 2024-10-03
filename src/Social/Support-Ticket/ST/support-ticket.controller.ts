import { Controller, Post, Body, Req, Put, Param, ParseIntPipe, Delete, Patch } from '@nestjs/common';
import { SupportTicketsService } from './support-ticket.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateSTDto } from './dto/createST.dto';
import { UpdateSTDto } from './dto/updateST.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/User/user/entity/user.entity';

@ApiTags('Support_Ticket')
@ApiBearerAuth()
@Controller('ST')
export class SupportTicketsController {
  constructor(private readonly supportTicketsService: SupportTicketsService) {}

  @Post()
  async createST(
    @Req() req:Request,
    @Body() createSTDto:CreateSTDto
  ){
    const userPhone = (req.user as any).result.phone;
    return await this.supportTicketsService.createST(userPhone,createSTDto)
  }

  @Put('/:stId')
  async updateST(
    @Param('stId',ParseIntPipe) stId:number,
    @Req() req:Request,
    @Body() updateSTDto: UpdateSTDto
  ){
    const currentUserPhone = (req.user as any).result.phone;
    return await this.supportTicketsService.updateST(
      stId,
      currentUserPhone,
      updateSTDto
    )
  }

  @Delete('/:stId')
  async removeST(
    @Param('stId',ParseIntPipe) stId:number,
    @Req() req:Request,
  ){
    const currentUserPhone = (req.user as any).result.phone;
    return await this.supportTicketsService.removeST(stId,currentUserPhone)
  }

  @Roles(UserRole.ADMIN)
  @Patch('/:stId')
  async closeST(
    @Param('stId',ParseIntPipe) stId:number,
  ){
    return await this.supportTicketsService.closeST(stId)
  }
}
