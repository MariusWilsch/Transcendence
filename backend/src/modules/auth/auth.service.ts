import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  googleLogin(req) {
    if (!req.user) {
      return 'No user from google'
    }
    return {
      message: 'User Info from Google',
      user: req.user
    }
  }
  hello() {
    return "Hello"
  }
}

// TODO:

// -authentication
// -authorization: jwt, passport, session, cookies
