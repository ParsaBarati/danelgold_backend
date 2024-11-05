import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSliderDto, SliderResponseDto } from './dto/create-slider.dto';
import { SliderEntity } from './entity/slider.entity';

@Injectable()
export class SliderService {
  constructor(
    @InjectRepository(SliderEntity)
    private readonly sliderRepository: Repository<SliderEntity>,
  ) {}

  async createSlider(createSliderDto: CreateSliderDto): Promise<SliderResponseDto> {
    const slider = this.sliderRepository.create(createSliderDto);
    await this.sliderRepository.save(slider);
    return slider;
  }

  async getSlider(): Promise<SliderResponseDto[]> {
    const sliders = await this.sliderRepository.find({ relations: ['auction'] });
    return sliders.map(slider => ({
      id: slider.id,
      auctionId: slider.auction?.id,
      link: slider.link,
      imagePath: slider.imagePath,
    }));
  }
}
