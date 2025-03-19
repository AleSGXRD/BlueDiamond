import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: process.env.ENABLE_CORS ?? 'http://localhost:4200', // Reemplaza con la URL de tu cliente
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si necesitas enviar cookies o headers de autorización
  });

  console.log('Working for port: ', process.env.PORT);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
