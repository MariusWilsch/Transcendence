import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gatewat';
import { PrismaClient } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'modules/auth/auth.service';
import { UserService } from 'modules/user/user.service';

@Module({
  imports:[JwtModule.register({
  }),],
  providers: [ChatService, ChatGateway, PrismaClient, AuthService,UserService],
  controllers: [ChatController],
})
export class ChatModule {}
