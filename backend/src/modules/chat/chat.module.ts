import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gatewat';
import { PrismaClient } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[JwtModule.register({
  }),],
  providers: [ChatService, ChatGateway, PrismaClient],
  controllers: [ChatController],
})
export class ChatModule {}
