import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('')
  .setDescription('')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

export const documentFactory = (app: INestApplication) =>
  SwaggerModule.createDocument(app, config);
