import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './modules/chat/chat.module';
import { GameModule } from './modules/game/game.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from 'modules/auth/auth.module';
import { AuthController } from 'modules/auth/auth.controller';
import { AuthService } from 'modules/auth/auth.service';
import { PrismaModule } from 'modules/prisma/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Email2FAService } from 'modules/auth/nodemailer/email.service';
import { EmailModule } from 'modules/auth/nodemailer/email.module';
import { handleClientsConnection } from 'websocket/Conn.gateway';

@Module({
	imports: [
		ChatModule,
		GameModule,
		UserModule,
		AuthModule,
		PrismaModule,
		JwtModule,
		EmailModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'Avataruploads/'),
		}),
	],
	controllers: [AppController, AuthController],
	providers: [
		AppService,
		AuthService,
		JwtService,
		Email2FAService,
		handleClientsConnection,
	],
})
export class AppModule {}
