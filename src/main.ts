import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { swagger_api_doc } from './constants/swagger-doc';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { AppLogger } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  });

  // handle glob global exceptions

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // swagger api doc setting up
  const config = new DocumentBuilder()
    .setTitle(swagger_api_doc['title'])
    .setDescription(swagger_api_doc['description'])
    .setVersion(swagger_api_doc['version'][0])
    .addTag(swagger_api_doc['tag'])
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
