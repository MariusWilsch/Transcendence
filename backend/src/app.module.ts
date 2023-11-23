import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat/chat.module';
import { GameModule } from './modules/game/game.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from 'modules/auth/auth.module';
import { AuthController } from 'modules/auth/auth.controller';

@Module({
  imports: [ChatModule, GameModule, UserModule, AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthModule],
})
export class AppModule {}
