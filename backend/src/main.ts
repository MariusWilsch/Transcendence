import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketio from 'socket.io';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { URL } from './modules/auth/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();

  const allowedOrigin = [`${URL}:3000`];

  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  

  
  app.useWebSocketAdapter(new IoAdapter(app));
  app.use(cookieParser());
  
  await app.listen(3001);
}
bootstrap();
