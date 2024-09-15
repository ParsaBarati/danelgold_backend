import { Module } from '@nestjs/common';
import { PaginationService } from './pagitnate.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PaginationService],
  exports: [PaginationService],
})
export class PaginateModule {}
