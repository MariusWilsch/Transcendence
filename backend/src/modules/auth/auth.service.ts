import { Injectable, Req } from '@nestjs/common';
import { authDto } from './auth.tdo';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';
import { User } from '@prisma/client';


@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private users: User[] = [];

  getUser(user: authDto): User {
    // console.log(user);
    const newUser = {
      intraId: user.UId,
      fullname: user.usual_full_name,
      login: user.username,
      email: user.email,
      Avatar: user.Avatar,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  getAllusers(): User[] {
    return this.users;
  }

   getUserFromCookie(req: any): User | undefined {
    const jwt = req.jwt;

    if (!jwt) {
      return undefined;
    }

    try {
      const payload = this.jwtService.verify(jwt, {
        secret: JWT_SECRET,
      });

      const user = payload.userWithoutDate;

      console.log('payload: ', payload);
      return user;
    } catch (error) {
      console.error('JWT Verification Error:', error);
      return undefined;
    }
  }
}

// TODO:

// -authentication
// -authorization: jwt, passport, session, cookies
