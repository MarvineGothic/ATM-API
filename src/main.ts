import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import Config from './common/config';
import { AppModule } from './AppModule';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('ATM API')
    .setDescription('ATM API')
    .setVersion('1.0')
    .addServer('/', 'Local Environment')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(Config.Server.port);

  console.log(`Listening on port ${Config.Server.port}...`);
}
bootstrap();
