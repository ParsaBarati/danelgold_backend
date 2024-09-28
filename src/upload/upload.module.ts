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

@Module({
  imports: [
    TypeOrmModule.forFeature([Upload,User]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerConfigFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, PaginationService],
})
export class UploadModule {}
