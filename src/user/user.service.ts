import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/index';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '@/user/entity/user.entity';
import { SignupDto } from '@/auth/dto/signup-dto';
import { UpdateUserDTO } from '@/user/dto/update-user.dto';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { UserInformation } from '@/user/interface/userInformation.interface';
import { Subscribe } from '@/subscribe/entity/subscribe.entity';
import { Token } from '@/auth/token/entity/token.entity';
import { SmsService } from '@/services/sms.service';
import { ConfigService } from '@nestjs/config';
import { editDateUser } from '@/user/dto/edit-user-date.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly smsService: SmsService,
    private readonly configService: ConfigService,
  ) {}

  async singupUser(createUserDTO: SignupDto) {
    const existingUser = await this.userRepository.findOne({
      where: { phone: createUserDTO.phone },
    });

    if (existingUser) {
      throw new BadRequestException(
        'کاربری با این شماره همراه قبلاً حساب کاربری ساخته است',
      );
    }

    const NewUser = this.userRepository.create({
      ...createUserDTO,
    });

    const result = await this.userRepository.save(NewUser);
    return result;
  }

  async updateUser(
    phone: string,
    updateUserDTO: UpdateUserDTO,
  ): Promise<ApiResponses<User>> {
    const existingUser = await this.userRepository.findOne({
      where: { phone: phone },
    });

    if (!existingUser) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const hashedPassword = updateUserDTO.password
      ? await bcrypt.hash(updateUserDTO.password, 10)
      : existingUser.password;

    Object.assign(existingUser, {
      ...updateUserDTO,
      password: hashedPassword,
      updatedAt: new Date(),
    });

    const updateUser = await this.userRepository.save(existingUser);
    return createResponse(200, updateUser, 'آپدیت شد');
  }

  async deleteUsers(phone: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }
    
    await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.delete(Subscribe, {
          userPhone: phone,
        });
        await transactionalEntityManager.delete(User, { phone });
      },
    );

    return 'کاربر با موفقیت پاک شد';
  }

  async getUserByPhone(phone: string): Promise<ApiResponses<UserInformation>> {
    const user = await this.userRepository.findOneBy({ phone });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const userInformation: UserInformation = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      roles: user.role,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const result = userInformation;
    return createResponse(200, result, null);
  }

  async getUserDataWithToken(userPhone: string) {
    const existingUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.subscribes', 'subscribe')
      .leftJoin('user.userDetail', 'userDetail')
      .where('user.phone = :phone', { phone: userPhone })
      .orderBy('userDetail.loginDate', 'DESC')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.phone',
        'user.imageUrl',
        'user.createdAt',
        'user.updatedAt',
        'user.lastLogin',
        'userDetail.ip',
        'userDetail.platform',
        'userDetail.browser',
        'userDetail.versionBrowser',
        'userDetail.versionPlatform',
        'userDetail.loginDate',
        'subscribe.isActive',
      ])
      .limit(1)
      .getOne();

    if (existingUser) {
      return existingUser;
    } else {
      return { error: 'کاربری با این شماره پیدا نشد', status: 404 };
    }
  }

  async editDataUser(authHeader: string, editData: editDateUser) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('توکن وجود ندارد');
    }

    const token = authHeader.split(' ')[1];

    const tokenData = await this.tokenRepository
      .createQueryBuilder('token')
      .leftJoin('token.user', 'user')
      .where('token.token = :token', { token })
      .select(['token.token', 'user.phone'])
      .getOne();

    if (!tokenData) {
      throw new UnauthorizedException('توکن اشتباه است');
    }

    const updateData: Partial<User> = {
      updatedAt: new Date(),
    };

    if (editData.firstName !== undefined) {
      updateData.firstName = editData.firstName;
    }
    if (editData.lastName !== undefined) {
      updateData.lastName = editData.lastName;
    }
    if (editData.imageUrl !== undefined) {
      updateData.imageUrl = editData.imageUrl;
    }

    if (Object.keys(updateData).length > 1) {
      const updatedUser = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(updateData)
        .where('phone = :phone', { phone: tokenData.user.phone })
        .returning([
          'phone',
          'firstName',
          'lastName',
          'imageUrl',
          'updatedAt',
        ])
        .execute();

      const updatedUserData = updatedUser.raw[0];
      delete updatedUserData.password;

      return {
        message: 'با موفقیت بروز شد',
        user: updatedUserData,
        status: 200,
      };
    } else {
      const currentUser = await this.userRepository.findOne({
        where: { phone: tokenData.user.phone },
      });

      if (!currentUser) {
        throw new NotFoundException('کاربری با این شناسه یافت نشد');
      }

      delete currentUser.password;

      return { message: 'بدون تغییرات', user: currentUser, status: 200 };
    }
  }
}
