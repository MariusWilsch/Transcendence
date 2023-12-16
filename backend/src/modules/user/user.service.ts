import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, User } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  constructor() {}

  async getAllUsers() {
    try {
      const allUsers = await prisma.user.findMany();
      return allUsers;
    } catch (e) {
      console.log('Error: ', e);
      return undefined;
    }
  }

  async getUserbyId(id: string) {
    try {
      const User = await prisma.user.findUnique({
        where: {
          intraId: id,
        },
      });
      // check if the avattar exist
      if (User && User.Avatar) {
        User.Avatar = User.Avatar;
      }
      //check if the avatar exist in the url

      return User;
    } catch (error: any) {
      console.log('Error in getUserbyId: ', error);
    }
  }

  async getUserbyLogin(login: string) {
    try {
      const User = await prisma.user.findUnique({
        where: {
          login: login,
        },
      });
      return User;
    } catch (error: any) {
      console.log('Error in getUserbyLogin: ', error);
    }
  }


  async updateLogin(userId: string, newLogin: string): Promise<void> {
    const user = await this.getUserbyId(userId);

    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return;
    }

    try {
      await prisma.user.update({
        where: {
          intraId: userId,
        },
        data: {
          login: newLogin,
        },
      });
      await prisma.user.update({
        where: {
          intraId: userId,
        },
        data: {
          isRegistred: true,
        },
      });
    } catch (error) {
      console.error('Error updating login:', error);
    }
  }

  async updateAvatar(userId: string, newAvatar: string): Promise<void> {
    try {
      await prisma.user.update({
        where: {
          intraId: userId,
        },
        data: {
          Avatar: newAvatar,
        },
      });
      await prisma.user.update({
        where: {
          intraId: userId,
        },
        data: {
          isRegistred: true,
        },
      });
    } catch (error) {
      console.error('Error updating login:', error);
    }
  }


  async uniqueLogin(login: string): Promise<boolean> {
    const user = await this.getUserbyLogin(login);

    if (user) {
      return false;
    }
    return true;
  }
}
