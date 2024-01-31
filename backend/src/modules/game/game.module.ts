import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { AuthService } from 'modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'modules/user/user.service';

@Module({
	providers: [GameService, GameGateway, AuthService, JwtService, UserService],
	controllers: [GameController],
})
export class GameModule {}
