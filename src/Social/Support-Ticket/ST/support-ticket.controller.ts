import { Controller, Post, Body, Req, Put, Param, ParseIntPipe, Delete, Patch } from '@nestjs/common';
import { SupportTicketsService } from './support-ticket.service';
import { ApiBearerAuth, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateSTDto } from './dto/createST.dto';
import { UpdateSTDto } from './dto/updateST.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/User/user/entity/user.entity';

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

  @Roles(UserRole.ADMIN)
  @Patch('/:stId')
  async closeST(
    @Param('stId',ParseIntPipe) stId:number,
  ){
    return await this.supportTicketsService.closeST(stId)
  }
}
