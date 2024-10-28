import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { Request } from 'express';
import { CreateStoryDto } from './entity/dto/createStory.dto';
import { UpdateStoryDto } from './entity/dto/updateStory.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Story')
@ApiBearerAuth()
@Controller('story')
export class StoriesController {
    constructor(private readonly storyService: StoriesService) {}

    @ApiOperation({ summary: 'Create Story' })
    @Post()
    async createStory(
        @Req() req: Request,
        @Body() createStoryDto: CreateStoryDto
    ) {
        return await this.storyService.createStory(req.user as any, createStoryDto);
    }

    @ApiOperation({ summary: 'Update Story' })
    @Put('/:id')
    async updateStory(
        @Param('id', ParseIntPipe) storyId: number,
        @Req() req: Request,
        @Body() updateStoryDto: UpdateStoryDto
    ) {
        const currentUserIdentifier = (req.user as any).phone || (req.user as any).email;
        return await this.storyService.updateStory(storyId, currentUserIdentifier, updateStoryDto);
    }

    @ApiExcludeEndpoint()
    @Delete('/:id')
    async removeStory(
        @Param('id', ParseIntPipe) storyId: number,
        @Req() req: Request, 
    ) {
        const currentUserIdentifier = (req.user as any).phone || (req.user as any).email;
        return await this.storyService.removeStory(storyId, currentUserIdentifier);
    }
}
