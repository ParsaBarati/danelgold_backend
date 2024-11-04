import { Controller, Post, Body } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { FilterMarketplacesDto } from './dto/filter-marketplace.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('MarketPlace')
@ApiBearerAuth()
@Controller('marketplaces')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @ApiOperation({ summary: 'Filter MarketPlaces Base on APi' })
  @Post('filter')
  async filterMarketplaces(
    @Body() filterMarketplacesDto: FilterMarketplacesDto
  ){
    return await this.marketplaceService.filterMarketplaces(filterMarketplacesDto);
  }
}
