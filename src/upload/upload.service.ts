import { PaginationResult } from '@/common/paginate/pagitnate.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entity/uplaod.entity';
import { Repository } from 'typeorm';
import { join } from 'path';

import fs from 'fs-extra';
import { ApiResponses, createResponse } from '@/utils/response.util';
import { PaginationService } from '@/common/paginate/pagitnate.service';

import { User } from '@/User/user/entity/user.entity';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly paginationService: PaginationService,
  ) {}

  async createUpload(file: any): Promise<{ upload: Upload; link: string }> {
    if (!file) {
      throw new NotFoundException('فایلی برای آپلود یافت نشد');
    }

    const sizeFile = file.size;
    const uploadFileName = file.filename;
    const uploadDestination = file.destination;
    const uploadMemType = file.mimetype;

    const newUpload = this.uploadRepository.create({
      name: uploadFileName,
      size: sizeFile,
      memType: uploadMemType,
      destination: uploadDestination,
    });

    const savedUpload = await this.uploadRepository.save(newUpload);

    // Generate the file link
    const baseUrl = process.env.BASE_URL_UPLOAD;
    const encodedFileName = `${savedUpload.destination.replace(/\\/g, '/')}/${encodeURIComponent(savedUpload.name)}`;
    const link = baseUrl + encodedFileName;

    // Return an object with the Upload entity and the generated link
    return { upload: savedUpload, link };
  }

  async getAllUploads(
    query: any,
  ): Promise<ApiResponses<PaginationResult<Upload>>> {
    const { page, limit, search, sort, sortOrder } = query;

    const queryBuilder = this.uploadRepository.createQueryBuilder('upload');

    if (search) {
      queryBuilder.andWhere('upload.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sort) {
      queryBuilder.orderBy(`upload.${sort}`, sortOrder as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('upload.id', 'DESC');
    }

    const paginationResult = await this.paginationService.paginate<Upload>(
      queryBuilder,
      page,
      limit,
    );

    const baseUrl = process.env.BASE_URL_UPLOAD;

    const uploadsWithLinks = paginationResult.data.map((upload) => ({
      ...upload,
      link:
        baseUrl +
        `${upload.destination.replace(/\\/g, '/')}` +
        `/${encodeURIComponent(upload.name).replace(/%5C/g, '/')}`,
    }));

    const resultWithLinks = {
      ...paginationResult,
      data: uploadsWithLinks,
    };

    return createResponse(200, resultWithLinks);
  }

  async deleteUpload(id: number): Promise<ApiResponses<{ message: string }>> {
    const upload = await this.uploadRepository.findOne({ where: { id } });

    if (!upload) {
      throw new NotFoundException('فایل یافت نشد');
    }

    const filePath = join(upload.destination, upload.name);

    await this.uploadRepository.remove(upload);

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted successfully:', filePath);
      }
    });

    return createResponse(200, { message: 'فایل با موفقیت حذف شد' });
  }

  async deleteMultipleUploads(
    ids: number[],
  ): Promise<ApiResponses<{ message: string }>> {
    const uploads = await this.uploadRepository.findByIds(ids);

    if (uploads.length === 0) {
      throw new NotFoundException('هیچ فایلی یافت نشد');
    }

    for (const upload of uploads) {
      const filePath = join(upload.destination, upload.name);

      await this.uploadRepository.remove(upload);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully:', filePath);
        }
      });
    }

    return createResponse(200, { message: 'فایل‌ها با موفقیت حذف شدند' });
  }

  async getUploadById(id: number): Promise<any> {
    const upload = await this.uploadRepository.findOne({
      where: { id },
    });

    if (!upload) {
      throw new NotFoundException('فایلی پیدا نشد');
    }

    const name = upload.name;
    const destination = upload.destination;
    console.log(`destination ${destination}`);
    const filePath = join(destination, name).replace(/\\/g, '/');

    console.log(`filePath ${filePath}`);

    const baseUrl = process.env.BASE_URL_UPLOAD;
    const encodedFileName =
      `${destination.replace(/\\/g, '/')}` + `/${encodeURIComponent(name)}`;
    const uploadWithLink = {
      ...upload,
      link: `${baseUrl}${encodedFileName}`,
    };

    return createResponse(200, uploadWithLink);
  }

  async getUploadByPath(name: string): Promise<any> {
    const upload = await this.uploadRepository.findOne({
      where: { name },
    });

    if (!upload) {
      throw new NotFoundException('فایلی پیدا نشد');
    }

    const uploadName = upload.name;
    const destination = upload.destination;
    console.log(`destination ${destination}`);
    const filePath = join(destination, uploadName).replace(/\\/g, '/');

    console.log(`filePath ${filePath}`);

    return createResponse(200, filePath);
  }

  async createProfilePictureUpload(
    file: any,
    Identifier: string,
  ): Promise<ApiResponses<any>> {
    if (!file) {
      throw new NotFoundException('پارامتر ارسالی صحیح نیست');
    }

    const user = await this.userRepository.findOne({ 
      where: [{ phone: Identifier },{ email: Identifier }] 
    });

    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    const newUpload = this.uploadRepository.create({
      name: file.filename,
      size: file.size,
      memType: file.mimetype,
      destination: file.destination,
    });

    const savedUpload = await this.uploadRepository.save(newUpload);

    user.profilePic =
      `${process.env.BASE_URL_UPLOAD}` +
      `${savedUpload.destination.replace(/\\/g, '/')}` +
      `/${encodeURIComponent(savedUpload.name)}`;
    await this.userRepository.save(user);

    const uploadWithLink = {
      ...savedUpload,
      link: user.profilePic,
      profilePic: user.profilePic,
    };

    return createResponse(
      200,
      uploadWithLink,
      'عکس پروفایل با موفقیت آپلود شد',
    );
  }
}
