import { Module } from "@nestjs/common";
import { PassportModule } from '@nestjs/passport';
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { IntraStrategy } from "./42.strategy";
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from "@nestjs/config";


@Module({
    imports: [
      ConfigModule.forRoot(),
      PassportModule,
      ],
    controllers: [AuthController],
    providers: [AuthService, IntraStrategy, ConfigService],
})
export class AuthModule {}