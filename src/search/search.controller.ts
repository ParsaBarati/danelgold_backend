import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import {Public} from "@/common/decorators/public.decorator";

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @ApiOperation({ summary: 'Search' })
  @ApiQuery({ name: 'query', required: true, type: String, description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results per page' })
  @Get()
  async search(
    @Query('query') query: string,
    
  ) {
    if (!query) {
      throw new BadRequestException('Please provide a search query');
    }
    return this.searchService.search(query);
  }
}
