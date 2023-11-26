import { Injectable, Req } from '@nestjs/common';
import { authDto } from './auth.tdo';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';

type user = {
  username: string;
  usual_full_name: string;
  email: string;
  UId: string;
  Avatar: string;
};

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private users: user[] = [
    {
      username: 'imad',
      usual_full_name: 'f name',
      email: 'email',
      UId: 'UId',
      Avatar: 'Avatar',
    },
    {
      username: 'mimouni',
      usual_full_name: 'f name2',
      email: 'email2',
      UId: 'UId2',
      Avatar: 'Avatar2',
    },
  ];

  getUser(req: any): authDto {
    // console.log(req);
    const newUser = {
      username: req.username,
      usual_full_name: req.usual_full_name,
      email: req.email,
      UId: req.UId,
      Avatar: req.Avatar,
    };

    const jwt = this.jwtService.sign(newUser, { secret: JWT_SECRET });
    console.log(jwt);

    this.users.push(newUser);

    return newUser;
  }

  getAllusers(): user[] {
    return this.users;
  }
}

// TODO:

// -authentication
// -authorization: jwt, passport, session, cookies
