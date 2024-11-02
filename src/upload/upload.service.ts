import {PaginationResult, PaginationService} from '@/common/paginate/pagitnate.service';
import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Upload} from './entity/uplaod.entity';
import {Repository} from 'typeorm';
import {join} from 'path';

import fs from 'fs-extra';
import {ApiResponses, createResponse} from '@/utils/response.util';

import {User} from '@/user/user/entity/user.entity';
import { Post } from '@/social/post/posts/entity/posts.entity';

@Injectable()
export class UploadService {
    constructor(
        @InjectRepository(Upload)
        private readonly uploadRepository: Repository<Upload>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly paginationService: PaginationService,
    ) {
    }

    async createUploads(files: Express.Multer.File[]): Promise<{ uploads: Upload[]; links: string[] }> {
        if (!files || !files || files.length === 0) {
            throw new NotFoundException('No files to upload');
        }

        const uploads = [];
        const links = [];
        const baseUrl = process.env.BASE_URL_UPLOAD;

        const timestamp = Date.now();
        for (const file of files) {
            const sizeFile = file.size;
            const uploadFileName = file.filename;
            const uploadDestination = file.destination;
            const uploadMemType = file.mimetype;

            const newUpload = this.uploadRepository.create({
                name: uploadFileName,
                size: sizeFile,
                memType: file.mimetype,
                destination: file.destination,
            });

            const savedUpload = await this.uploadRepository.save(newUpload);
            const encodedFileName = `${savedUpload.destination.replace(/\\/g, '/')}/${encodeURIComponent(savedUpload.name)}`;
            const link = baseUrl + encodedFileName;

            uploads.push(savedUpload);
            links.push(link);
        }

        return {uploads, links};
    }

    getMemTypeByExtension(filename) {
        const extension = filename.split('.').pop().toLowerCase();

        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'heic':
            case 'png':
            case 'gif':
                return 'image';
            case 'mp4':
            case 'mkv':
            case 'avi':
            case 'mov':
                return 'video';
            case 'mp3':
            case 'wav':
            case 'aac':
                return 'audio';
            case 'pdf':
            case 'doc':
            case 'docx':
            case 'txt':
                return 'document';
            default:
                return 'unknown';
        }
    }
    async createUpload(file: any): Promise<{ upload: Upload; link: string }> {
        if (!file) {
            throw new NotFoundException('No file to upload');
        }

        const sizeFile = file.size;
        const uploadFileName = file.filename;
        const uploadDestination = file.destination;
        const uploadMemType = this.getMemTypeByExtension(uploadFileName);

        const newUpload = this.uploadRepository.create({
            name: uploadFileName,
            size: sizeFile,
            memType: uploadMemType,
            destination: uploadDestination,
        });

        const savedUpload = await this.uploadRepository.save(newUpload);

        savedUpload.memType = uploadMemType;
        // Generate the file link
        const baseUrl = process.env.BASE_URL_UPLOAD;
        const encodedFileName = `${savedUpload.destination.replace(/\\/g, '/')}/${encodeURIComponent(savedUpload.name)}`;
        const link = baseUrl + encodedFileName;

        console.log(savedUpload)
        // Return an object with the Upload entity and the generated link
        return {upload: savedUpload, link};
    }

    async uploadReel(file: Express.Multer.File, caption: string, user: User): Promise<Post> {
        const { link } = await this.createUpload(file);

        const reel = this.postRepository.create({
            mediaUrl: link,
            media: link,
            caption,
            isReel: true,
            user,
        });

        return this.postRepository.save(reel);
    }

    async getAllUploads(
        query: any,
    ): Promise<ApiResponses<PaginationResult<Upload>>> {
        const {page, limit, search, sort, sortOrder} = query;

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
        const upload = await this.uploadRepository.findOne({where: {id}});

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

        return createResponse(200, {message: 'فایل با موفقیت حذف شد'});
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

        return createResponse(200, {message: 'فایل‌ها با موفقیت حذف شدند'});
    }

    async getUploadById(id: number): Promise<any> {
        const upload = await this.uploadRepository.findOne({
            where: {id},
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
            where: {name},
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
        user: User,
    ): Promise<ApiResponses<any>> {
        if (!file) {
            throw new NotFoundException('File not found');
        }


        if (!user) {
            throw new NotFoundException('User not found');
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
            'Profile picture uploaded successfully!',
        );
    }
}
