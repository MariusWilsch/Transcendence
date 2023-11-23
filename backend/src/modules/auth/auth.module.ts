// auth.module.ts

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy'; // Your custom strategy

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }), // Use the strategy you implement
  ],
  providers: [GoogleStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
