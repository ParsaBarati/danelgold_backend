import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeDto } from './dto/Subscription.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notication.dto';

@ApiTags('Subscribe')
@ApiBearerAuth()
@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Post()
  async subscribeUser(
    @Req() req: Request, 
    @Body() subscribeDto: SubscribeDto
  ){
    const userPhone = (req.user as any).result.phone;
    return await this.subscribeService.subscribeUser(userPhone, subscribeDto);
  }

  @Delete()
  async unsubscribeUser(
    @Req() req: Request
  ){
    const userPhone = (req.user as any).result.phone;
    return this.subscribeService.unsubscribeUser(userPhone);
  }

  @Get('send-notif')
  async sendNotif(){
    return await this.subscribeService.sendNotif();
  }
  @Post('send-data-notif')
  async sendContent(
    @Body() notDto: CreateNotificationDto
  ){
    const { title, content } = notDto;
    return this.subscribeService.sendContent(title, content);
  }
}
