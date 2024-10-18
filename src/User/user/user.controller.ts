import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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

  @Roles(UserRole.ADMIN)
  @Post('user')
  async createUser(@Body() createUserDTO: CreateUserByAdminDTO) {
    return await this.userService.createUser(createUserDTO);
  }

  @Roles(UserRole.ADMIN)
  @Put('user/:phone')
  async updateUser(
    @Param('phone') phone: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    return await this.userService.updateUser(phone, updateUserDTO);
  }

  @Put('profile')
  async editUser(
    @Headers('authorization') authHeader: string,
    @Body() editData: editDateUser,
  ) {
    return await this.userService.editDataUser(authHeader, editData);
  }

  @ApiOperation({ summary: 'Get All Users' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'roles', required: false })
  @ApiQuery({ name: 'all', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get('users')
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') searchInput?: string,
    @Query('roles') roles?: string,
    @Query('all') all?: string,
    @Query('sortBy') sort?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const result = await this.userService.getUsers(
      page || 1,
      limit || 10,
      searchInput || '',
      roles,
      all || 'false',
      sort || 'id',
      sortOrder || 'DESC',
    );
    return {
      status: 200,
      ...result,
      adminCount: await this.userService.getAdminCount(),
      userCount: await this.userService.getUserCount(),
    };
  }

  @Get('profile')
  async getUserDataWithToken(
    @Req() req: Request
  ){
    const userPhone = (req.user as any).result.phone;
    return await this.userService.getUserDataWithToken(userPhone);
  }

  @Get('homepage')
  async getHomepageData(){
    return await this.getHomepageData()
  }


  @Roles(UserRole.ADMIN)
  @Get('user/:phone')
  async getUserByPhone(
    @Param('phone') phone: string
  ){
    return await this.userService.getUserByPhone(phone);
  }

  @Roles(UserRole.ADMIN)
  @Delete('delete/:phone')
  async deleteUsers(
    @Param('phone') phone: string
  ){
    return await this.userService.deleteUsers(phone);
  }
}
