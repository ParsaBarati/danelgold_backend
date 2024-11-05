import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SeederService} from "@/database/seeder.service";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seeder = app.get(SeederService);

    console.log('Starting seeding...');
    await seeder.seedDatabase();
    console.log('Seeding completed.');

    await app.close();
}

bootstrap();
