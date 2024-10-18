import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IPFSService } from '@/services/IPFS.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@Controller('pinata')
export class PinataController {
  constructor(private readonly ipfsService: IPFSService) {}

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileUrl = await this.ipfsService.uploadFileToIPFS(file);
    return { fileUrl };
  }

  @Post('upload-metadata')
  async uploadMetadata(
    @Body() metadata: any
  ) {
    const metadataUrl = await this.ipfsService.uploadMetadataToIPFS(metadata);
    return { metadataUrl };
  }
}
