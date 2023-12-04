import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from 'modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UserService, AuthService, JwtService],
  controllers: [UserController],
  exports: [UserService], // allowing the user service to be used in other modules
})
export class UserModule {}
