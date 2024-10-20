import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';


ApiTags('User')
@ApiBearerAuth()
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}


  
  @ApiOperation({summary: 'HomePage'})
  @Get('home')
  async getHomepageData(){
    return await this.userService.getHomepageData()
  }

  @ApiOperation({ summary: 'Profile By ID'})
  @Get('profile/:id')
  async getProfileById(
    @Param('id',ParseIntPipe) id: number
  ){
    return await this.userService.getProfileById(id)
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Get User Data' })
  @Get('user/:Identifier')
  async getUser(
    @Param('Identifier') Identifier: string
  ){
    return await this.userService.getUser(Identifier);
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Get All Users'})
  @Get('all')
    async getAllUsers(){
        return this.userService.getAllUsers();
    }

}
