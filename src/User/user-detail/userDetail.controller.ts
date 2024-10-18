import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserDetailService } from '@/User/user-detail/userDetail.service';

@Controller('user-detail')
export class UserDetailController {
  constructor(private readonly userDetailService: UserDetailService) {}

  @ApiOperation({ summary: 'Get All Users' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'sortOrder', required: false })
  @Get(':phone')
  async getUserDetail(
    @Param('phone') phone: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sort') sort?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ){
    const query = { page, limit, sort, sortOrder };
    return await this.userDetailService.getUserDetail(phone, query);
  }
}
