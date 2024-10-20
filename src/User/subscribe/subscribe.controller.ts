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
import { ApiBearerAuth, ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notication.dto';

@ApiExcludeController()
@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Post()
  async subscribeUser(
    @Req() req: Request, 
    @Body() subscribeDto: SubscribeDto
  ){
    const userIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
    return await this.subscribeService.subscribeUser(userIdentifier, subscribeDto);
  }

  @Delete()
  async unsubscribeUser(
    @Req() req: Request
  ){
    const userIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
    return this.subscribeService.unsubscribeUser(userIdentifier);
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
