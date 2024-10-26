import { Controller, Get, Query, Req } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({ summary:'Search' })
  @Get()
  async search(
    @Query('query') query: string,
    @Req() req:Request
){
    if (!query) {
      return { message: 'Please provide a search query' };
    }
    return this.searchService.search(query,(req.user as any));
  }
}
