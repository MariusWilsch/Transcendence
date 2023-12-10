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

  // @Post(':id/avatar')
  // async editavatar(@Param('id') userId: string, @Body() body: { newAvatar: string }) {
  //   console.log(body);
  //   try {
  //     let user = await this.userService.getUserbyId(userId);
  //     if (!user) {
  //       return { error: 'User not found', message: 'User not found' };
  //     }
  //     if (body.newAvatar.trim() === '') {
  //       return { error: 'Avatar can\'t be empty', message: 'Avatar can\'t be empty' };
  //     }
  //     await this.userService.updateAvatar(userId, body.newAvatar);
  //   } catch (error: any) {
  //     return { error: 'Failed to update Avatar', message: error.message };
  //   }
  // }

  // @Post(':id/avatar')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads', // specify the directory where files should be stored
  //       filename: (req, file, cb) => {
  //         const uniqueSuffix =
  //           Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         const extension = file.originalname.split('.').pop();
  //         cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
  //       },
  //     }),
  //   })
  // )
  // async editavatar(@Param('id') userId: string, @UploadedFile() avatar) {
  //   // 'avatar' is the name of the field in your form data

  //   // Handle the uploaded file, save the file path to your database, etc.
  //   const filePath = '/' + avatar.path;
  //   console.log(filePath);

  //   await this.userService.updateAvatar(userId, filePath);
  //   // Your logic to save the filePath to the database or perform any other operations
  //   return { message: 'Avatar uploaded successfully', filePath };
  // }

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
  
      // Extract the filename or URL from the avatar object
      const avatarFilename = avatar.filename;
      const avatarUrl = `http://localhost:3001/${avatarFilename}`;
  
      // Log or use the extracted information as needed
      console.log('Avatar Filename:', avatarFilename);
      console.log('Avatar URL:', avatarUrl);
  
      // Now you can use this information to update the user's avatar
      await this.userService.updateAvatar(userId, avatarUrl);
  
      // Return a response indicating success
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
