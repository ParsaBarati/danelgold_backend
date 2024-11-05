import { Controller, Get, Post, Body } from '@nestjs/common';
import { SliderService } from './slider.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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
}
