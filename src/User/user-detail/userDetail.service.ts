import { ApiResponses } from '@/utils/response.util';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDetail } from './entity/userDetail.entity';
import { CreateUserDetailDTO } from './dto/create-userDetail.dto';
import { UpdateUserDetailDTO } from './dto/update-userDetail.dto';
import { User } from '@/User/user/entity/user.entity';
import {
  PaginationResult,
  PaginationService,
} from '@/common/paginate/pagitnate.service';
import { createResponse } from '@/utils/response.util';

@Injectable()
export class UserDetailService {
  constructor(
    @InjectRepository(UserDetail)
    private readonly userDetailRepository: Repository<UserDetail>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  async createUserDetail(
    userPhone: string,
    userAgent: any,
  ): Promise<UserDetail[]> {
    const user = await this.userRepository.findOne({
      where: { phone: userPhone },
    });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const newUserDetail = this.userDetailRepository.create({
      user,
      ...userAgent,
      loginDate: new Date(),
    });

    return await this.userDetailRepository.save(newUserDetail);
  }

  async getUserDetail(
    userPhone: string,
    query: any,
  ): Promise<ApiResponses<PaginationResult<UserDetail>>> {
    const { page, limit, sort, sortOrder } = query;

    const queryBuilder = this.userDetailRepository
      .createQueryBuilder('userDetail')
      .leftJoin('userDetail.user', 'user')
      .where('user.phone = :userPhone', { userPhone });

    if (sort && sortOrder) {
      queryBuilder.orderBy(`userDetail.${sort}`, sortOrder);
    } else {
      queryBuilder.orderBy('userDetail.loginDate', 'DESC');
    }

    const paginationResult = await this.paginationService.paginate(
      queryBuilder,
      page,
      limit,
    );

    if (paginationResult.total === 0) {
      throw new NotFoundException('اطلاعات کاربر یافت نشد');
    }

    return createResponse(200, paginationResult);
  }

  async updateUserDetail(
    userPhone: string,
    updateUserDetailDTO: UpdateUserDetailDTO,
  ): Promise<UserDetail> {
    const user = await this.userRepository.findOne({
      where: { phone: userPhone },
    });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    let userDetail = await this.userDetailRepository.findOne({
      where: { user: { phone: userPhone } },
    });

    if (!userDetail) {
      userDetail = this.userDetailRepository.create({
        ...updateUserDetailDTO,
        user,
      });
    } else {
      Object.assign(userDetail, updateUserDetailDTO);
    }

    return await this.userDetailRepository.save(userDetail);
  }

  async deleteUserDetail(userPhone: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { phone: userPhone },
    });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    let userDetail = await this.userDetailRepository.findOne({
      where: { user: { phone: userPhone } },
    });

    await this.userDetailRepository.remove(userDetail);
  }
}
