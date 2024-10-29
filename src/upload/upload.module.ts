import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Upload } from './entity/uplaod.entity';
import { multerConfigFactory } from '@/common/utils/multer.utils';
import { PaginationService } from '@/common/paginate/pagitnate.service';
import { User } from '@/User/user/entity/user.entity';
import { Post } from '@/Social/Post/posts/entity/posts.entity';
import { TokenService } from '@/User/auth/token/token.service';
import { Token } from '@/User/auth/token/entity/token.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Upload,
      Post,
      Token,
      User
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerConfigFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadController],
  providers: [
    UploadService, 
    TokenService,
    JwtService,
    PaginationService
  ],
})
export class UploadModule {}
