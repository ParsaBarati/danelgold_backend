import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SliderEntity } from "./entity/slider.entity";
import { SliderController } from "./slider.controller";
import { SliderService } from "./slider.service";


@Module({
    imports: [TypeOrmModule.forFeature([SliderEntity])],
    controllers: [SliderController],
    providers: [SliderService]
})
export class SliderModule{}