import {UploadService} from './upload.service';
import {
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    ParseFilePipeBuilder,
    ParseIntPipe,
    Post,
    Query,
    Req,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import path from 'path';
import {Request, Response} from 'express';
import {Public} from '@/common/decorators/public.decorator';
import {ApiExcludeController, ApiQuery} from '@nestjs/swagger';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createUpload(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addMaxSizeValidator({
                    maxSize: 5 * 1024 * 1024, //b/kb/mb
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        )
            file: Express.Multer.File,
    ) {
        return await this.uploadService.createUpload(file);
    }

    @Post('profile-pic')
    @UseInterceptors(FileInterceptor('file'))
    async createProfilePictureUpload(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addMaxSizeValidator({
                    maxSize: 5 * 1024 * 1024, //b/kb/mb
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        )
            file: Express.Multer.File,
        @Req() req: Request,
    ) {
        return await this.uploadService.createProfilePictureUpload(file, req.user as any);
    }

    @ApiQuery({name: 'page', required: false})
    @ApiQuery({name: 'limit', required: false})
    @ApiQuery({name: 'search', required: false})
    @ApiQuery({name: 'sort', required: false})
    @ApiQuery({name: 'sortOrder', required: false})
    @Get('all')
    async getAllUploads(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('search') search?: string,
        @Query('sort', new DefaultValuePipe('id')) sort?: string,
        @Query('sortOrder', new DefaultValuePipe('DESC')) sortOrder?: string,
    ) {
        const query = {page, limit, search, sort, sortOrder};
        return this.uploadService.getAllUploads(query);
    }

    @Delete(':id')
    async deleteUpload(
        @Param('id') id: number
    ) {
        return this.uploadService.deleteUpload(id);
    }

    @Delete('')
    async deleteMultipleUploads(
        @Query('delete') ids: string,
    ) {
        const idArray = ids.split(',').map((id) => parseInt(id, 10));
        return this.uploadService.deleteMultipleUploads(idArray);
    }

    @Public()
    @Get('/path/:filePath')
    async getByPath(
        @Param('filePath') filePath: string,
        @Res() res: Response
    ) {
        const filePathClean = filePath.replace(/\\/g, '/');
        const file = await this.uploadService.getUploadByPath(filePathClean);
        if (!file) {
            throw new NotFoundException('فایلی پیدا نشد');
        }
        const absolutePath = path.resolve(__dirname, '..', '..', file.result);
        // ارسال فایل
        res.sendFile(absolutePath);
    }

    @Get(':id')
    async getUploadById(
        @Param(
            'id',
            new ParseIntPipe({
                errorHttpStatusCode: HttpStatus.BAD_REQUEST,
            }),
        )
            uploadId: number,
    ) {
        return await this.uploadService.getUploadById(uploadId);
    }
}
