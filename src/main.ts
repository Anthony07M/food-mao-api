import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { documentFactory } from './infrastructure/config/swagger/setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  SwaggerModule.setup('docs', app, () => documentFactory(app));

  app.use(helmet());
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
