import {Controller, Get, Post} from '@nestjs/common';
import { SeederService } from './seeder.service';

@Controller('seeder')
export class SeederController {
    constructor(private readonly seederService: SeederService) {}

    @Get('seed')
    async seedDatabase() {
        await this.seederService.seedDatabase();
        return { message: 'Database seeded successfully!' };
    }
}
