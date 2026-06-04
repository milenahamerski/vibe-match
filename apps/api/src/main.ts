import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // converte automaticamente os tipos
      whitelist: true, // remove propriedades não declaradas nos DTOs
      forbidNonWhitelisted: true, // lança erro se o corpo contiver campos extras
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('VibeMatch API')
    .setDescription('Documentação automática da API VibeMatch com Swagger')
    .setVersion('1.0')
    .addBearerAuth() // Para habilitar autenticação JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
