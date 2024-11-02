import { Controller, Post, Body, Req, Put, Param, ParseIntPipe, Delete, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateSTDto } from '@/social/support-ticket/st/dto/createST.dto';
import { UpdateSTDto } from '@/social/support-ticket/st/dto/updateST.dto';
import { SupportTicketsService } from '@/social/support-ticket/st/support-ticket.service';

@ApiExcludeController()
@Controller('ST')
export class SupportTicketsController {
  constructor(private readonly supportTicketsService: SupportTicketsService) {}

  @Post()
  async createST(
    @Req() req:Request,
    @Body() createSTDto:CreateSTDto
  ){
    const userIdentifier = (req.user as any).phone || (req.user as any).email;
    return await this.supportTicketsService.createST(userIdentifier,createSTDto)
  }

  @Put('/:stId')
  async updateST(
    @Param('stId',ParseIntPipe) stId:number,
    @Req() req:Request,
    @Body() updateSTDto: UpdateSTDto
  ){
    const currentUserIdentifier = (req.user as any).phone || (req.user as any).email;
    return await this.supportTicketsService.updateST(
      stId,
      currentUserIdentifier,
      updateSTDto
    )
  }

  @Delete('/:stId')
  async removeST(
    @Param('stId',ParseIntPipe) stId:number,
    @Req() req:Request,
  ){
    const currentUserIdentifier = (req.user as any).phone || (req.user as any).email;
    return await this.supportTicketsService.removeST(stId,currentUserIdentifier)
  }

  @Patch('/:stId')
  async closeST(
    @Param('stId',ParseIntPipe) stId:number,
  ){
    return await this.supportTicketsService.closeST(stId)
  }
}
