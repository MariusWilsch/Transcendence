import { Controller, Req, Res, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';
import { UserService } from 'modules/user/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { EmailService } from './nodemailer/email.service';

const prisma = new PrismaClient();

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private userservive: UserService,
    private emailService: EmailService
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
      return res.redirect(
        `http://localhost:3001/users/${userfromcookie.intraId}`
      );
    } catch (e) {
      console.log('Error: ', e);
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
        // res.redirect('http://localhost:3001/auth/user');

        const { created_at, updated_at, ...userWithoutDate } = userExists;
        // console.log('userWithoutDate: ', userWithoutDate);

        const payload = { userWithoutDate };
        const jwt = this.jwtService.sign(payload, {
          secret: JWT_SECRET,
        });
        res.cookie('jwt', jwt);
        res.cookie('id', userExists.intraId);
        return res.redirect('http://localhost:3000/profile');
      }

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

      const { created_at, updated_at, ...userWithoutDate } = user;
      const payload = { userWithoutDate };
      const jwt = this.jwtService.sign(payload, {
        secret: JWT_SECRET,
      });
      res.cookie('jwt', jwt);
      res.cookie('id', user.intraId);
      return res.redirect('http://localhost:3000/profile');
    } catch (e) {
      console.log('Error: ', e);
    }
  }

  @Get('logout')
  async logout(@Res() res: any) {
    try {
      res.clearCookie('jwt');
      res.redirect('http://localhost:3000');
      return 'logout';
    } catch (e) {
      console.log('Error: ', e);
      res.status(500).send('Internal Server Error');
    }
  }

  @Get('email')
  async sendEmail(): Promise<string> {
    const to = 'imimouni@student.1337.ma';
    // const to = 'imad.mimouni.123@gmail.com';

    const login = 'imimouni';
    const code = '12347895';

    const subject = 'Transcendance : 2FA Code';

    const text = `
<body style="font-family: Arial, sans-serif; color: #333;">

<p>Dear ${login},</p>

<p style="margin-bottom: 10px;">
Thank you for signing up in Transcendance! To complete your registration, here is your verification code:
</p>

<p style="color: red; font-weight: bold;">
${code}
</p>

<p>
This code will expire in 5 minutes. If you did not sign up for Transcendance, please ignore this email.
</p>

<p style="font-weight: bold;">
The Transcendance Team
</p>

</body>
    `;

    await this.emailService.sendMail(to, subject, text);

    return 'Email sent!';
  }
}

// TODO
// 1- user logs in to 42, ans issues a token (JWT)
// 2- the broswer store the JWT in a cookie or local storage
// 3- on every request, the browser sends the JWT in the header
// 4- the server validates the JWT and sends the response
// 5- the server sends a new JWT if the old one is expired
