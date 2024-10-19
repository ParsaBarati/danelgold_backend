import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { Request } from 'express';
import { CreateStoryDto } from './entity/dto/createStory.dto';
import { UpdateStoryDto } from './entity/dto/updateStory.dto';
import { ApiBasicAuth, ApiExcludeController, ApiTags } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('story')
export class StoriesController {
    constructor(private readonly storyService: StoriesService){}

    @Post()
    async createStory(
        @Req() req: Request,
        @Body() createStoryDto: CreateStoryDto
    ){
        const userIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
        return await this.storyService.createStory(userIdentifier,createStoryDto)
    }

    @Put('/:id')
    async updateStory(
        @Param('id',ParseIntPipe) storyId: number,
        @Req() req: Request,
        @Body() updateStoryDto: UpdateStoryDto
    ){
        const currentUserIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
        return await this.storyService.updateStory(storyId,currentUserIdentifier,updateStoryDto)
    }

    @Delete(':/id')
    async removeStory(
        @Param('id',ParseIntPipe) storyId: number,
        @Req() req: Request, 
    ){
        const currentUserIdentifier = (req.user as any).result.phone || (req.user as any).result.email;
        return await this.storyService.removeStory(storyId,currentUserIdentifier)
    }
}
