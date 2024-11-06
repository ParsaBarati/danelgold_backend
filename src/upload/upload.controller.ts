import {UploadService} from './upload.service';
import {
    Body,
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
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import path from 'path';
import {Request, Response} from 'express';
import {Public} from '@/common/decorators/public.decorator';
import {ApiOkResponse, ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';

@ApiTags('Uploads')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {
    }

    @ApiOperation({summary: 'Upload Multiple Files in Bulk'})
    @Post('bulk')
    @UseInterceptors(FilesInterceptor('files'))
    async createUploads(
        @UploadedFiles(
            new ParseFilePipeBuilder()
                .addMaxSizeValidator({
                    maxSize: 500 * 1024 * 1024, // 500MB max file size
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        ) files: Express.Multer.File[],
    ) {
        return await this.uploadService.createUploads(files);
    }

    @ApiOperation({summary: 'Upload Single File'})
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async createUpload(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .build(),
        ) file: Express.Multer.File,
    ) {
        console.log('Here!!!!!');
        return await this.uploadService.createUpload(file);
    }

    @ApiOperation({summary: 'Upload Reel'})
    @Post('Reel')
    @ApiOperation({summary: 'Upload a new reel'})
    @UseInterceptors(FileInterceptor('file'))
    async uploadReel(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addMaxSizeValidator({maxSize: 50 * 1024 * 1024}) // Adjust max file size for videos
                .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY}),
        ) file: Express.Multer.File,
        @Body('caption') caption: string,
        @Req() req
    ) {
        return this.uploadService.uploadReel(file, caption, (req.uesr as any));
    }

    @ApiOperation({summary: 'Upload Profile Picture'})
    @Post('profile-pic')
    @UseInterceptors(FileInterceptor('file'))
    async createProfilePictureUpload(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addMaxSizeValidator({
                    maxSize: 5 * 1024 * 1024, // 5MB max file size
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        ) file: Express.Multer.File,
        @Req() req: Request,
    ) {
        return await this.uploadService.createProfilePictureUpload(file, req.user as any);
    }

    @ApiOperation({summary: 'Upload Cover Profile Picture'})
    @Post('cover')
    @UseInterceptors(FileInterceptor('file'))
    async createProfileCoverPictureUpload(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addMaxSizeValidator({
                    maxSize: 5 * 1024 * 1024, // 5MB max file size
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        ) file: Express.Multer.File,
        @Req() req: Request,
    ) {
        return await this.uploadService.createProfilePictureUpload(file, req.user as any);
    }

    @ApiOperation({summary: 'Get All Uploads with Filtering Options'})
    @ApiQuery({name: 'page', required: false, example: 1, description: 'Page number for pagination'})
    @ApiQuery({name: 'limit', required: false, example: 10, description: 'Number of items per page'})
    @ApiQuery({name: 'search', required: false, description: 'Search term to filter uploads'})
    @ApiQuery({name: 'sort', required: false, description: 'Sort by a specific field', example: 'id'})
    @ApiQuery({name: 'sortOrder', required: false, description: 'Order of sorting', example: 'DESC'})
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

    @ApiOperation({summary: 'Delete an Upload by ID'})
    @ApiOkResponse({description: 'Upload deleted successfully'})
    @Delete(':id')
    async deleteUpload(@Param('id', ParseIntPipe) id: number) {
        return this.uploadService.deleteUpload(id);
    }

    @ApiOperation({summary: 'Delete Multiple Uploads'})
    @ApiQuery({name: 'delete', description: 'Comma-separated list of IDs to delete'})
    @Delete()
    async deleteMultipleUploads(
        @Query('delete') ids: string
    ){
        const idArray = ids.split(',').map((id) => parseInt(id, 10));
        return this.uploadService.deleteMultipleUploads(idArray);
    }

    @ApiOperation({summary: 'Get File by Path'})
    @Public()
    @Get('/path/:filePath')
    async getByPath(@Param('filePath') filePath: string, @Res() res: Response) {
        const filePathClean = path.normalize(filePath).replace(/\\/g, '/');
        const file = await this.uploadService.getUploadByPath(filePathClean);
        if (!file) {
            throw new NotFoundException('File not found');
        }
        const absolutePath = path.resolve(__dirname, '..', '..', file.result);
        res.sendFile(absolutePath);
    }

    @ApiOperation({summary: 'Get Upload by ID'})
    @Get(':id')
    async getUploadById(
        @Param(
            'id',
            new ParseIntPipe({
                errorHttpStatusCode: HttpStatus.BAD_REQUEST,
            }),
        ) uploadId: number,
    ) {
        return await this.uploadService.getUploadById(uploadId);
    }
}
