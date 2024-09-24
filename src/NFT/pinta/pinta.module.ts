import { Module } from '@nestjs/common';
import { PinataService } from './pinta.service';
import { PinataController } from './pinta.controller';
import { IPFSService } from '@/services/IPFS.service';

@Module({
  providers: [PinataService,IPFSService],
  controllers: [PinataController],
})
export class PinataModule {}
