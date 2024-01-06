import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat/chat.module';
import { GameModule } from './modules/game/game.module';
import { UserModule } from './modules/user/user.module';
import { GameGateway } from 'game.gateway';

@Module({
  imports: [ChatModule, GameModule, UserModule],
  controllers: [AppController],
  providers: [AppService, GameGateway],
})
export class AppModule {}
