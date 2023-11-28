import { Module } from "@nestjs/common";
import { PassportModule } from '@nestjs/passport';
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { IntraStrategy } from "./42.strategy";
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from "@nestjs/config";
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';

@Module({
    imports: [
      ConfigModule.forRoot(),
      PassportModule,
      JwtModule.register({
        // secret: JWT_SECRET,
        signOptions: { expiresIn: '1d' },
        // signOptions: { expiresIn: '60s' },
      }),
      ],
    controllers: [AuthController],
    providers: [AuthService, IntraStrategy, ConfigService],
})
export class AuthModule {}