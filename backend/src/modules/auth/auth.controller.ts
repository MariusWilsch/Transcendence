import {
  Controller,
  Req,
  Res,
  Get,
  UseGuards,
  Options,
  Redirect,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';

const prisma = new PrismaClient();

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Get()
  home(): any {
    return 'Home';
  }

  @Get('me')
  getProfile(): any {
    return 'U are logged in';
  }

  @Get('user')
  // @UseGuards(AuthGuard('42'))
  async user(@Req() req: any) {
    try {
      const ccokie = req.cookies;
      // const ccokie = req.cookies['jwt'];
      // console.log('cookie', ccokie);

      const user = await this.authService.getUserFromCookie(ccokie);
      return `hello ${user.fullname}` || 'Error : indefind user';
    } catch (e) {
      console.log('Error: ', e);
      return 'Error : indefind user';
    }
  }

  @Get('createUser')
  createProfile(): any {
    return 'create new user';
  }

  @Get('42')
  @UseGuards(AuthGuard('42'))
  login(@Res() res: any) {
    // return res.redirect('http://localhost:3001/auth');
    // return { url: 'http://localhost:3001' };
    // return res.status(200).redirect('/auth');
    // return res.redirect(`${process.env.REDIRECT_BASE_URL}`);
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  // @Redirect('http://localhost:3001/auth')
  async callback(@Req() req: any, @Res() res: any, @Res() response: any) {
    try {
      // console.log(req.user);
      let userdata = this.authService.getUser(req.user);

      // return;
      // check if user exists in db
      try {
        const userExists = await prisma.user.findUnique({
          where: {
            intraId: userdata.intraId,
          },
        });
        if (userExists) {
          console.log('user already logged in');
          res.redirect('http://localhost:3001/auth/user');
          return;
        }
      } catch (e) {
        console.log('Error: ', e);
      }

      // console.log(res.user);
      // console.log(  req.UId, req.usual_full_name, req.username, req.email,req.Avatar) ;
      // return;

      const user = await prisma.user.create({
        data: {
          intraId: req.user.UId,
          fullname: req.user.usual_full_name,
          login: req.user.username,
          email: req.user.email,
          Avatar: req.user.Avatar,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // return;

      const payload = { user };
      const jwt = await this.jwtService.signAsync(payload, {
        secret: JWT_SECRET,
      });
      res.cookie('jwt', jwt);
      response.redirect('http://localhost:3001/auth/user');
    } catch (e) {
      console.log('Error: ', e);
    }
  }
}

// TODO
// 1- user logs in to 42, ans issues a token (JWT)
// 2- the broswer store the JWT in a cookie or local storage
// 3- on every request, the browser sends the JWT in the header
// 4- the server validates the JWT and sends the response
// 5- the server sends a new JWT if the old one is expired
