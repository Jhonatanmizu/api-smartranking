import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('SmartRanking API')
    .setDescription('The SmartRanking API description')
    .setVersion('1.0')
    .addTag('App')
    .addTag('Players')
    .addTag('Categories')
    .addTag('Challengers')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  logger.log(`Application is running on: http://localhost:${PORT}`);
  logger.log(`Swagger documentation: http://localhost:${PORT}/api/docs`);
}
bootstrap();
