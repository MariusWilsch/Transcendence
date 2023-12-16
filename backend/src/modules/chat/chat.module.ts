import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gatewat';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [ChatService, ChatGateway, PrismaClient],
  controllers: [ChatController],
})
export class ChatModule {}
