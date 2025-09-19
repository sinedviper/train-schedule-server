import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from '@common/exceptionFilter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { TConfiguration } from '@config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<TConfiguration>);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const isDev = configService.get('nodeEnv') === 'development';

  app.enableCors({
    origin: isDev ? ['http://localhost:19006', 'http://localhost:3000'] : [],
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Train API')
    .setDescription(
      `API for train schedules and auth. Schema database: https://drawsql.app/teams/sinedviper/diagrams/train-schedule`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('port');
  await app.listen(port || 4000);

  console.log(`🚀 Application is running on: http://localhost:${port || 4000}`);
  console.log(
    `📖 Swagger docs available at: http://localhost:${port || 4000}/api`,
  );
}

bootstrap();
