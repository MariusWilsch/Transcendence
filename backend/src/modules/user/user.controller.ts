import { Controller, Get, Param, Post } from '@nestjs/common';
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
}
