import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService)
  const { port, hostServer, prefix } = configService.get('app')

  app.setGlobalPrefix(prefix)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  await app.listen(port);

  console.log(`Server running on ${hostServer}/${prefix}`)
}

bootstrap();
