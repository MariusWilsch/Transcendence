import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, User } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
    constructor() {}
    
    async getAllUsers()
    {
      try {
          const allUsers = await prisma.user.findMany();
          return allUsers;
        } catch (e) {
          console.log('Error: ', e);
          return undefined
        }
    }

    async getUserbyId(id : string)
    {
      try {
          const User = await prisma.user.findUnique(
            {
              where: {
                intraId: id,
              },
            }
          );
          return User;
        } catch (error : any) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
              throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'NotFoundException',
                message: 'User cannot be found',
              }, HttpStatus.NOT_FOUND, {cause: error});
            }
          }
        };
    }
}
