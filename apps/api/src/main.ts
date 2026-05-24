import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // converte automaticamente os tipos
      whitelist: true, // remove propriedades não declaradas nos DTOs
      forbidNonWhitelisted: true, // lança erro se o corpo contiver campos extras
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
