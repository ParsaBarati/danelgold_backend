import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import passport from 'passport';
import { SwaggerHelper } from '@/common/utils/swagger.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.enableCors({ origin: true, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(passport.initialize());

  const config = new DocumentBuilder()
    .setTitle('Danel Gold')
    .setDescription('project danel gold api')
    .setVersion('1.0')
    .addTag('DanelGold')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);

  if (SwaggerHelper.prototype.setup) {
    await new SwaggerHelper().setup(app);  
  }

  const port = process.env.PORT || 3000;  
  await app.listen(port, '0.0.0.0');
  console.log(`running on port ${port}...`);

  function bytesToMB(bytes) {
    return bytes / (1024 * 1024); 
  }

  const memoryUsage = process.memoryUsage();

  const rssMB = bytesToMB(memoryUsage.rss);
  const heapTotalMB = bytesToMB(memoryUsage.heapTotal);
  const heapUsedMB = bytesToMB(memoryUsage.heapUsed);
  const externalMB = bytesToMB(memoryUsage.external);
  const arrayBuffersMB = bytesToMB(memoryUsage.arrayBuffers);

  const totalMemoryMB =
    rssMB + heapTotalMB + heapUsedMB + externalMB + arrayBuffersMB;

  console.log({
    totalMemory: totalMemoryMB.toFixed(2) + ' MB',
  });
}

bootstrap();

