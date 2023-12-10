import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

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
  async post(@Param('id') userId: string, @Body() body: { newLogin: string }) {
    try {
      let user = await this.userService.getUserbyId(userId);
      if (!user) {
        return { error: 'User not found', message: 'User not found' };
      }
      if (body.newLogin.trim() === '') {
        return { error: 'Login can\'t be empty', message: 'Login can\'t be empty' };
      }
      await this.userService.updateLogin(userId, body.newLogin);
    } catch (error: any) {
      return { error: 'Failed to update login', message: error.message };
    }
  }
}
