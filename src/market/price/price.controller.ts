import {Body, Controller, Get, Post, Query} from "@nestjs/common";
import {PricesService} from "./price.service";
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {FilterCollectionsDto} from "../collection/dto/FilterCollection.dto";
import {Public} from "@/common/decorators/public.decorator";


@ApiTags('Price')
@Controller('price')
export class PriceController {
    constructor(private readonly priceService: PricesService) {
    }


    @ApiOperation({summary: 'Filter Collections Base on API'})
    @Post('collections')
    async filterCollections(
        @Body() filterCollectionsDto: FilterCollectionsDto
    ) {
        return await this.priceService.filterCollections(filterCollectionsDto);
    }

    @ApiOperation({summary: 'Get Danel Website Homepage'})
    @Get('home')
    @Public()
    async getPrices(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        return await this.priceService.getPrices(page, limit);
    }


}
