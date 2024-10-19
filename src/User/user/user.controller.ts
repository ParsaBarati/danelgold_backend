import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Put,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserByAdminDTO } from './dto/create-user.dto';
import { UserRole } from './entity/user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { editDateUser } from './dto/edit-user-date.dto';


@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('home')
  async getHomepageData(){
    return await this.userService.getHomepageData()
  }


  @Get('user/:phone')
  async getUserByPhone(
    @Param('phone') phone: string
  ){
    return await this.userService.getUserByPhone(phone);
  }

}
