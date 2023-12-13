import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'modules/auth/auth.service';
import { JwtAuthGuard } from 'modules/auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from '../auth/constants';


@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get()
  async getAllUsers(): Promise<User[] | undefined> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserbyId(@Param('id') id: string): Promise<User | undefined> {
    return this.userService.getUserbyId(id);
  }

  @Post(':id/login')
  async editlogin(
    @Param('id') userId: string,
    @Body() body: { newLogin: string }
  ) {
    try {
      let user = await this.userService.getUserbyId(userId);
      if (!user) {
        return { error: 'User not found', message: 'User not found' };
      }
      if (body.newLogin.trim() === '') {
        return {
          error: "Login can't be empty",
          message: "Login can't be empty",
        };
      }
      await this.userService.updateLogin(userId, body.newLogin);
    } catch (error: any) {
      return { error: 'Failed to update login', message: error.message };
    }
  }

  @Post(':id/verifyOtp')
  async verifyOtp(
    @Param('id') userId: string,
    @Body() body: { otp: string },
    @Res() res: any
  ) {
    try {
      const isVerified = await this.authService.verifyOtp(userId, body.otp);

      if (isVerified) {
        // return res.redirect('http://localhost:3000/profile');
        const userExists = await this.userService.getUserbyId(userId);

        const { created_at, updated_at, ...userWithoutDate } = userExists;

        const payload = { userWithoutDate };
        const jwt = this.jwtService.sign(payload, {
          secret: JWT_SECRET,
        });

        
        res.cookie('jwt', jwt);
        return res.json({ sucess: true });
      } else {
        return res.json({ sucess: false });
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      res
        .json({ success: false, error: 'Internal Server Error' });
    }
  }

  @Get(':id/enableOtp')
  @UseGuards(JwtAuthGuard)
  async enableOtp(
    @Param('id') userId: string,
    @Res() res: any
  ) {
    try {
      const isEnabled = await this.authService.enableOtp(userId);

      if (isEnabled) {
        return res.json({ sucess: true });
      } else {
        return res.json({ sucess: false });
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      res
        .json({ success: false, error: 'Internal Server Error' });
    }
  }

  @Get(':id/disableOtp')
  @UseGuards(JwtAuthGuard)
  async disableOtp(
    @Param('id') userId: string,
    @Res() res: any
  ) {
    try {
      const disEnabled = await this.authService.disableOtp(userId);

      if (disEnabled) {
        return res.json({ sucess: true });
      } else {
        return res.json({ sucess: false });
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      res
        .json({ success: false, error: 'Internal Server Error' });
    }
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async editavatar(
    @Param('id') userId: string,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    try {
      let user = await this.userService.getUserbyId(userId);
      if (!user) {
        return { error: 'User not found', message: 'User not found' };
      }
      if (!avatar) {
        return {
          error: "Avatar can't be empty",
          message: "Avatar can't be empty",
        };
      }

      const avatarFilename = avatar.filename;
      const avatarUrl = `http://localhost:3001/${avatarFilename}`;

      // console.log('Avatar Filename:', avatarFilename);
      // console.log('Avatar URL:', avatarUrl);

      await this.userService.updateAvatar(userId, avatarUrl);

      return {
        success: true,
        message: 'Avatar updated successfully',
        avatarFilename,
        avatarUrl,
      };
    } catch (error: any) {
      return { error: 'Failed to update Avatar', message: error.message };
    }
  }
}
