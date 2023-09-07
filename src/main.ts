import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogginInterceptor } from './logging.interceptor';
import { TransformInterceptor } from './transform.Interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LogginInterceptor(),
    new TransformInterceptor(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // class-transformer가 적용되도록 함.
    }),
  );
  await app.listen(3000);
}
bootstrap();
