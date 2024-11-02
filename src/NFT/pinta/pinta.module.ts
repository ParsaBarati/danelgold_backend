import { Module } from '@nestjs/common';
import { IPFSService } from '@/services/IPFS.service';
import { PinataService } from './pinta.service';
import { PinataController } from './pinta.controller';

@Module({
  providers: [PinataService,IPFSService],
  controllers: [PinataController],
})
export class PinataModule {}
