import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();

  const allowedOrigin = 'http://localhost:3000';

  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204, // for preflight requests
  });



  app.use(cookieParser());
  
  await app.listen(3001);
}
bootstrap();
