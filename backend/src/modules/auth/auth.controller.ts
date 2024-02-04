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
import { authDto } from './auth.tdo';

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
  async user(@Req() req: any, @Res() res: any) {
    try {
      const ccokie = req.cookies;

      const userfromcookie = this.authService.getUserFromCookie(ccokie);
      if (userfromcookie === undefined) {
        return res.json({ succes: false });
      }
      
      return res.redirect(`${URL}:3001/users/${userfromcookie.intraId}`);
    } catch (e) {
      return res.json({ succes: false });
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

      const checklogin = await prisma.user.findUnique({
        where: {
          login: req.user.username,
        },
      });
      if (checklogin) {
        return res.redirect(`${URL}:3000`);
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

  @Post('signup')
  async signup(@Body() body: any, @Res() res: any, @Res() response: Response) {
    try {
      const user = await this.authService.create(body);

      if (user === undefined) {
        return res.json({ succes: false, message: 'User already exists' });
      }
      const { created_at, updated_at, ...userWithoutDate } = user;
      const payload = { userWithoutDate };
      const jwt = this.jwtService.sign(payload, {
        secret: JWT_SECRET,
      });
      res.cookie('jwt', jwt);
      return res.json({ succes: true, Id: user.intraId });
    } catch (e) {
      console.log('Error signup: ', e);
      return res.json({ succes: false, message: 'User created' });
    }
  }

  @Post('login')
  async login(@Body() body: any, @Res() res: any) {
    try {
      const user: any = await this.authService.findsignup(body);
      if (user === undefined) {
        return res.json({ succes: false, message: 'Wrong user name' });
      } else if (user === 'wrong password') {
        return res.json({ succes: false, message: 'Wrong password' });
      } else if (user === '2FA') {
        res.clearCookie('jwt');
        const userexit = await prisma.user.findUnique({
          where: {
            login: body.username,
          },
        });
        res.cookie('id', userexit.intraId);
        return res.json({ succes: true, message: 'Two factor authentication' });
      } else if (user !== 'wrong login' && user !== undefined) {
        const { created_at, updated_at, ...userWithoutDate } = user;
        const payload = { userWithoutDate };
        const jwt = this.jwtService.sign(payload, {
          secret: JWT_SECRET,
        });
        res.cookie('jwt', jwt);

        return res.json({ succes: true, Id: user.intraId });
      }
    } catch (e) {
      console.log('Error login: ', e);
      return res.json({ succes: false, message: 'User created' });
    }
  }
}
