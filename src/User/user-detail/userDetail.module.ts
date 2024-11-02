import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserDetailController } from '@/user/user-detail/userDetail.controller';
import { UserDetailService } from '@/user/user-detail/userDetail.service';
import { User } from '@/user/user/entity/user.entity';
import { UserDetail } from '@/user/user-detail/entity/userDetail.entity';
import { PaginationService } from '@/common/paginate/pagitnate.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDetail])],
  controllers: [UserDetailController],
  providers: [UserDetailService, PaginationService],
})
export class UserDetailModule {}
