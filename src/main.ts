import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('main');

  // FIXME: Convertirmos nuestra app tradicional en un microservicio
  // Sepodria tambien trabajar un hibrido
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.nats_servers
      }
    }
  );

  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  // app.setGlobalPrefix('api');

  await app.listen();
  console.log('Started product submodule');
  logger.log( `Products microservice running port ::: ${ envs.port }` );
}
bootstrap();
