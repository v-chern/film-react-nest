import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { DevLogger } from './logger/dev.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true, //transform payload to DTO class
    whitelist: true //exclude properties from payload which are not in DTO
   }));
  app.useLogger(new DevLogger());
  await app.listen(3000);
}
bootstrap();
