import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { SliderService } from './slider.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateSliderDto } from './dto/update-slider.dto';

@ApiTags('Slider')
@ApiBearerAuth()
@Controller('slider')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @ApiOperation({ summary: 'create Slider' })
  @Post()
  async createSlider(@Body() createSliderDto: CreateSliderDto) {
    return this.sliderService.createSlider(createSliderDto);
  }

  @ApiOperation({ summary: 'get slider for homepage' })
  @Get()
  async getSlider() {
    return this.sliderService.getSlider();
  }

  @ApiOperation({ summary: 'Update Slider' })
  @Patch(':id')
  async updateSlider(
    @Param('id', ParseIntPipe) id:  number,
    @Body() updateSliderDto: UpdateSliderDto,
  ) {
    return this.sliderService.updateSlider(id, updateSliderDto);
  }
}
