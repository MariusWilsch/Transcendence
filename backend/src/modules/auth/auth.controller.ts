import { Controller, Req, Res, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, prisma: PrismaService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  login(@Res() res: any): Promise<any> {
    return res.redirect(`${process.env.REDIRECT_BASE_URL}`);
  }

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async callback(@Req() req: any, @Res() res: any) {
    try {
      // console.log(req.user);
      let userdata = this.authService.getUser(req.user);
      const user = await prisma.user.create({
        data: {
          login: userdata.username,
          fullname: userdata.usual_full_name,
          email: userdata.email,
          intraId: userdata.UId,
          Avatar: userdata.Avatar,
        },
      });
      console.log('userdata', userdata);
      
      res.redirect('http://localhost:3001/auth');
      console.log(this.authService.getAllusers());
    } catch (e) {
      console.log("Error: ",e);
    }
  }
}
