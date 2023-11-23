import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '961110001848-cfd4bnpdfqmjgclqr2suiu6idpqpcv81.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3001/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    profile: any,
    done: VerifyCallback
  ) {
    // Add your logic to validate the user, save to the database, etc.
    // const user = {
    //   id: profile.id,
    //   name: profile.displayName,
    //   email: profile.emails[0].value,
    // };
    // return done(null, user);
    console.log( 'imad',  profile);
  }
}
