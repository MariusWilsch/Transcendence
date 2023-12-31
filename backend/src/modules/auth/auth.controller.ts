import {
  Controller,
  Req,
  Res,
  Get,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET, URL } from './constants';
import { UserService } from 'modules/user/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Email2FAService } from './nodemailer/email.service';

const prisma = new PrismaClient();

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private userService: UserService,
    private Email2FAService: Email2FAService
  ) {}

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async user(@Req() req: any, @Res() res: any) {
    try {
      const ccokie = req.cookies;

      const userfromcookie = this.authService.getUserFromCookie(ccokie);
      if (userfromcookie === undefined) {
        return undefined;
      }

      return res.redirect(`${URL}:3001/users/${userfromcookie.intraId}`);
    } catch (e) {
      console.log('Error auth user : ', e);
    }
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async callback(@Req() req: any, @Res() res: any) {
    try {
      let userdata = this.authService.getUser(req.user);

      const userExists = await prisma.user.findUnique({
        where: {
          intraId: userdata.intraId,
        },
      });
      if (userExists) {
        await prisma.user.update({
          where: {
            intraId: userdata.intraId,
          },
          data: {
            isRegistred: true,
          },
        });

        if (this.authService.getUserFromCookie(req.cookies) === undefined) {
          const { created_at, updated_at, ...userWithoutDate } = userExists;

          const payload = { userWithoutDate };
          const jwt = this.jwtService.sign(payload, {
            secret: JWT_SECRET,
          });
          res.cookie('jwt', jwt);

          if (userExists.isTfaEnabled === true) {
            res.cookie('id', userExists.intraId);
            res.clearCookie('jwt');
            this.authService.generateOtp(userExists);
            return res.redirect(`${URL}:3000/2FA`);
          }
        }
        return res.redirect(`${URL}:3000/profile/${userExists.intraId}`);
      }

      const user = await prisma.user.create({
        data: {
          intraId: req.user.UId,
          fullname: req.user.usual_full_name,
          login: req.user.username,
          email: req.user.email,
          Avatar: req.user.Avatar,
          isRegistred: false,
          isTfaEnabled: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      const { created_at, updated_at, ...userWithoutDate } = user;
      const payload = { userWithoutDate };
      const jwt = this.jwtService.sign(payload, {
        secret: JWT_SECRET,
      });
      res.cookie('jwt', jwt);
      // res.cookie('id', user.intraId);
      return res.redirect(`${URL}:3000/profile/${user.intraId}`);
    } catch (e) {
      console.log('Error auth cllback : ', e);
    }
  }

  @Get('logout')
  async logout(@Res() res: any) {
    try {
      res.clearCookie('id');
      res.clearCookie('jwt');
      res.redirect(`${URL}:3000`);
      return 'logout';
    } catch (e) {
      console.log('Error logout: ', e);
    }
  }
}
