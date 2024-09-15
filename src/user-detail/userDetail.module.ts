import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserDetailController } from './userDetail.controller';
import { UserDetailService } from './userDetail.service';
import { User } from '@/user/entity/user.entity';
import { UserDetail } from './entity/userDetail.entity';
import { PaginationService } from '@/common/paginate/pagitnate.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDetail])],
  controllers: [UserDetailController],
  providers: [UserDetailService, PaginationService],
})
export class UserDetailModule {}
