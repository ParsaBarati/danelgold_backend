import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { Request } from 'express';
import { CreateStoryDto } from './entity/dto/createStory.dto';
import { UpdateStoryDto } from './entity/dto/updateStory.dto';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@Controller('story')
export class StoriesController {
    constructor(private readonly storyService: StoriesService){}

    @Post()
    async createStory(
        @Req() req: Request,
        @Body() createStoryDto: CreateStoryDto
    ){
        const userPhone = (req.user as any).result.phone;
        return await this.storyService.createStory(userPhone,createStoryDto)
    }

    @Put('/:id')
    async updateStory(
        @Param('storyId',ParseIntPipe) storyId: number,
        @Req() req: Request,
        @Body() updateStoryDto: UpdateStoryDto
    ){
        const currentUserPhone = (req.user as any).result.phone;
        return await this.storyService.updateStory(storyId,currentUserPhone,updateStoryDto)
    }

    @Delete(':/id')
    async removeStory(
        @Param('storyId',ParseIntPipe) storyId: number,
        @Req() req: Request, 
    ){
        const currentUserPhone = (req.user as any).result.phone;
        return await this.storyService.removeStory(storyId,currentUserPhone)
    }
}
