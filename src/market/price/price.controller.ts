import { Body, Controller, Get, Post } from "@nestjs/common";
import { PricesService } from "./price.service";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FilterCollectionsDto } from "../collection/dto/FilterCollection.dto";


@ApiTags('Price')
@ApiBearerAuth()
@Controller('price')
export class PriceController{
    constructor( private readonly priceService: PricesService){}


    @ApiOperation({ summary: 'Filter Collections Base on API' })
    @Post('collections')
    async filterCollections(
        @Body() filterCollectionsDto: FilterCollectionsDto
    ){
    return await this.priceService.filterCollections(filterCollectionsDto);
    }

    @ApiOperation({ summary: 'Get Danel Website Homepage' })
    @Get('home')
    async getPrices(){
       return await this.priceService.getPrices() 
    }

}
