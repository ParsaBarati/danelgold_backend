import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSliderDto, SliderResponseDto } from './dto/create-slider.dto';
import { SliderEntity } from './entity/slider.entity';
import { UpdateSliderDto } from './dto/update-slider.dto';

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

  async updateSlider(id: number, updateSliderDto: UpdateSliderDto): Promise<SliderResponseDto> {
    const slider = await this.sliderRepository.findOne({ where: { id } });
    if (!slider) {
      throw new NotFoundException(`Slider with ID ${id} not found`);
    }

    if (updateSliderDto.auctionId !== undefined) {
      slider.auction = { id: updateSliderDto.auctionId } as any; // Assuming auction ID reference
    }
    if (updateSliderDto.link !== undefined) {
      slider.link = updateSliderDto.link;
    }
    if (updateSliderDto.imagePath !== undefined) {
      slider.imagePath = updateSliderDto.imagePath;
    }

    await this.sliderRepository.save(slider);
    return {
      id: slider.id,
      auctionId: slider.auction?.id,
      link: slider.link,
      imagePath: slider.imagePath,
    };
  }
}
