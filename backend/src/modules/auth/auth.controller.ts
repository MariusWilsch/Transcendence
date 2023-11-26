import { Controller, Req, Res, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}


  @Get('me')
  getProfile(): any {
    return 'U are logged in'
  }

  @Get('createUser')
  createProfile(): any {
    return 'create new user'
  }

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

      // check if user exists in db
      const userExists = await prisma.user.findUnique({
        where: {
          login: userdata.username,
        },
      });
    
      if (userExists) {
        console.log('user already logged in');
        res.redirect('http://localhost:3001/auth/me');
        return;
      }

      const user = await prisma.user.create({
        data: {
          login: userdata.username,
          fullname: userdata.usual_full_name,
          email: userdata.email,
          intraId: userdata.UId,
          Avatar: userdata.Avatar,
        },
      });



      // console.log('userdata', userdata);
      
      console.log(this.authService.getAllusers());
      res.redirect('http://localhost:3001/auth/createUser');
    } catch (e) {
      console.log("Error: ",e);
    }
  }
}


// TODO
// 1- user logs in to 42, ans issues a token (JWT)
// 2- the broswer store the JWT in a cookie or local storage
// 3- on every request, the browser sends the JWT in the header
// 4- the server validates the JWT and sends the response
// 5- the server sends a new JWT if the old one is expired

