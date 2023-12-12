import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

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
        return { error: 'Avatar can\'t be empty', message: 'Avatar can\'t be empty' };
      }
  
      const avatarFilename = avatar.filename;
      const avatarUrl = `http://localhost:3001/${avatarFilename}`;
  
      console.log('Avatar Filename:', avatarFilename);
      console.log('Avatar URL:', avatarUrl);
  
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
