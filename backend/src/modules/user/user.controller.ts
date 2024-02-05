import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Redirect,
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
import { JWT_SECRET, URL } from '../auth/constants';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Get()
  async getAllUsers(@Res() res: any): Promise<User[] | undefined> {
    try {
      const data = await this.userService.getAllUsers();
      res.json(data);
      return data;
    } catch (error) {
      console.error('Error getAllUsers:', error);
      return undefined;
    }
  }

  @Get('leaderboard')
  @UseGuards(JwtAuthGuard)
  async getLeaderboard(@Query('page') page: number, @Res() res: any) {
    try {
      if (page !== undefined) {
        const leaderboard = await this.userService.leaderboard(page);
        if (leaderboard !== undefined) {
          return res.json({ success: true, leaderboard });
        }
      } else {
        return res.json({ success: false });
      }
    } catch (error: any) {
      console.error('Error leaderboard:', error);
      return res.json({ success: false });
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async getUser(
    @Res() res: any,
    @Body() name: { searchTerm: string }
  ): Promise<User[] | undefined> {
    try {
      const data = await this.userService.getUsersbyInput(name.searchTerm);
      res.json(data);
      return data;
    } catch (error) {
      console.error('Error getUser:', error);
      return undefined;
    }
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async search(@Res() res, @Query('searchTerm') searchTerm: string) {
    const targetURL = `${URL}:3000/search?query=${encodeURIComponent(
      searchTerm
    )}`;
    return res.redirect(targetURL);
  }

  @Get('Gamehistory/:id')
  @UseGuards(JwtAuthGuard)
  async Gamehistory(@Param('id') id: string, @Res() res: any) {
    if (id === undefined || id === '' || id === null) {
      return res.json({ success: false });
    }
    try {
      const Gamehistory = await this.userService.Gamehistory(id);
      return res.json({ success: true, Gamehistory });
    } catch (error: any) {
      console.error('Error Gamehistory:', error);
      return res.json({ success: false });
    }
  }

  @Get('Achievements/:id')
  @UseGuards(JwtAuthGuard)
  async Achievements(@Param('id') id: string, @Res() res: any) {
    if (id === undefined || id === '' || id === null) {
      return res.json({ success: false });
    }
    try {
      const Achievements = await this.userService.Achievements(id);

      return res.json({ success: true, Achievements });
    } catch (error: any) {
      console.error('Error Achievements:', error);
      return res.json({ success: false });
    }
  }

  // @Get(':id')
  // async getUserbyId(@Param('id') id: string , @Res() res : any): Promise<User | undefined> {
  //   if (id === undefined || id === '' || id === null) {
  //     return undefined;
  //   }
  //   try {
  //     const data = await this.userService.getUserbyId(id);
  //     if (data === undefined) {
  //       return res.json({ succes: false });
  //     }
  //     return data;
  //   } catch (error) {
  //     console.error('Error getUserbyId:', error);
  //     return res.json({ succes: false });
  //   }
  // }
  @Get(':id')
  async getUserbyId(@Param('id') id: string , @Res() res : any): Promise<User | undefined> {
    if (id === undefined || id === '' || id === null) {
      return undefined;
    }
    try {
      const data = await this.userService.getUserbyId(id);
      if (data === undefined) {
        return res.json({ succes: false });
      }
      return res.json({ succes: true , data});
    } catch (error) {
      console.error('Error getUserbyId:', error);
      return res.json({ succes: false });
    }
  }

  @Post(':id/login')
  @UseGuards(JwtAuthGuard)
  async editlogin(
    @Param('id') userId: string,
    @Body() body: { newLogin: string },
    @Res() res: any
  ) {
    try {
      if (userId === undefined || userId === '' || userId === null) {
        return res.json({ success: false });
      }
      let user = await this.userService.getUserbyId(userId);
      if (!user) {
        return res.json({ success: false });
      }

      const uniqueLogin = await this.userService.uniqueLogin(body.newLogin);
      if (body.newLogin.trim() === '' || uniqueLogin === false) {
        return res.json({ success: false });
      }
      await this.userService.updateLogin(userId, body.newLogin);
      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error login ', error);
      return res.json({ success: false });
    }
  }

  @Post(':id/verifyOtp')
  async verifyOtp(
    @Param('id') userId: string,
    @Body() body: { otp: string },
    @Res() res: any
  ) {
    try {
      if (userId === undefined || userId === '' || userId === null) {
        return res.json({ sucess: false });
      }
      const isVerified = await this.authService.verifyOtp(userId, body.otp);

      if (isVerified) {
        const userExists = await this.userService.getUserbyId(userId);

        const { created_at, updated_at, ...userWithoutDate } = userExists;

        const payload = { userWithoutDate };
        const jwt = this.jwtService.sign(payload, {
          secret: JWT_SECRET,
        });

        res.cookie('jwt', jwt);
        res.clearCookie('id');
        return res.json({ sucess: true });
      } else {
        return res.json({ sucess: false });
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      res.json({ success: false, error: 'Internal Server Error' });
    }
  }

  @Get(':id/enableOtp')
  @UseGuards(JwtAuthGuard)
  async enableOtp(@Param('id') userId: string, @Res() res: any) {
    if (userId === undefined || userId === '' || userId === null) {
      return res.json({ sucess: false });
    }
    try {
      const isEnabled = await this.authService.enableOtp(userId);

      if (isEnabled) {
        return res.json({ sucess: true });
      } else {
        return res.json({ sucess: false });
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      res.json({ success: false, error: 'Internal Server Error' });
    }
  }

  @Get(':id/disableOtp')
  @UseGuards(JwtAuthGuard)
  async disableOtp(@Param('id') userId: string, @Res() res: any) {
    if (userId === undefined || userId === '' || userId === null) {
      return res.json({ sucess: false });
    }
    try {
      const disEnabled = await this.authService.disableOtp(userId);

      if (disEnabled) {
        return res.json({ sucess: true });
      } else {
        return res.json({ sucess: false });
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      res.json({ success: false, error: 'Internal Server Error' });
    }
  }

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async editavatar(
    @Param('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(gif|png|jpeg|jpg)' }),
        ],
      })
    ) avatar: Express.Multer.File,
    @Res() res: any,
    @Req() req: any
  ) {
    if (userId === undefined || userId === '' || userId === null) {
      return res.json({ sucess: false });
    }
    try {
      let user = await this.userService.getUserbyId(userId);
      if (!user) {
        return res.json({ success: false });
      }
      if (!avatar) {
        return res.json({ success: false });
      }
      if (avatar.size > 1024 * 1024 * 10 || avatar.size < 100) {
        return res.json({ success: false });
      }

      const avatarFilename = avatar.filename;
      const avatarpath = avatar.path;

      const avatarUrl = `${URL}:3001/${avatarFilename}`;

      await this.userService.updateAvatar(userId, avatarUrl);
      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error avatar:', error);
      return res.json({ success: false });
    }
  }

  @Post('addfriend')
  @UseGuards(JwtAuthGuard)
  async addfriend(
    @Body() body: { userId: string; friendId: string },
    @Res() res: any
  ) {
    try {
      const { userId, friendId } = body;
      if (userId === undefined || userId === '' || userId === null) {
        return res.json({ success: false });
      }
      if (friendId === undefined || friendId === '' || friendId === null) {
        return res.json({ success: false });
      }
      const isFriend = await this.userService.createFriend(userId, friendId);

      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error addfriend:', error);
      return res.json({ success: false });
    }
  }

  @Post('blockfriend')
  @UseGuards(JwtAuthGuard)
  async blockfriend(
    @Body() body: { userId: string; friendId: string },
    @Res() res: any
  ) {
    try {
      const { userId, friendId } = body;
      if (userId === undefined || userId === '' || userId === null) {
        return res.json({ success: false });
      }
      if (friendId === undefined || friendId === '' || friendId === null) {
        return res.json({ success: false });
      }
      const isBlocked = await this.userService.blockFriend(userId, friendId);

      if (isBlocked === 'alreadyFriend') {
        return res.json({ success: true });
      } else {
        return res.json({ success: true, isBlocked: false });
      }
    } catch (error: any) {
      console.error('Error addfriend:', error);
      return res.json({ success: false });
    }
  }

  @Post('removefrinship')
  @UseGuards(JwtAuthGuard)
  async removefrinship(
    @Body() body: { userId: string; friendId: string },
    @Res() res: any
  ) {
    try {
      const { userId, friendId } = body;
      if (userId === undefined || userId === '' || userId === null) {
        return res.json({ success: false });
      }
      if (friendId === undefined || friendId === '' || friendId === null) {
        return res.json({ success: false });
      }
      await this.userService.removefrinship(userId, friendId);

      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error addfriend:', error);
      return res.json({ success: false });
    }
  }

  @Get(':id/friends')
  @UseGuards(JwtAuthGuard)
  async getFriends(@Param('id') userId: string, @Res() res: any) {
    if (userId === undefined || userId === '' || userId === null) {
      return res.json({ success: false });
    }
   
    try {
      const friends = await this.userService.getFriends(userId);
      return res.json({ success: true, friends });
    } catch (error: any) {
      console.error('Error getFriends:', error);
      return res.json({ success: false });
    }
  }

  @Get(':id/onlinefriends')
  @UseGuards(JwtAuthGuard)
  async getonlineFriends(@Param('id') userId: string, @Res() res: any) {
    if (userId === undefined || userId === '' || userId === null) {
      return res.json({ success: false });
    }
    try {
      const onlinefriends = await this.userService.getonlineFriends(userId);
      return res.json({ success: true, onlinefriends });
    } catch (error: any) {
      console.error('Error getonlineFriends:', error);
      return res.json({ success: false });
    }
  }

  @Get(':id/PendingInvite')
  @UseGuards(JwtAuthGuard)
  async PendingInvite(@Param('id') userId: string, @Res() res: any) {
    if (userId === undefined || userId === '' || userId === null) {
      return res.json({ success: false });
    }
    try {
      const PendingInvite = await this.userService.PendingInvite(userId);
      const friendIds = PendingInvite.map((item) => item.friendId);
      const friendsDetails = await Promise.all(
        friendIds.map((id) => this.userService.getUserbyId(id))
      );

      return res.json({ success: true, friendsDetails });
    } catch (error: any) {
      console.error('Error getFriends:', error);
      return res.json({ success: false });
    }
  }

  @Get(':id/freindrequest')
  @UseGuards(JwtAuthGuard)
  async freindrequest(@Param('id') userId: string, @Res() res: any) {
    if (userId === undefined || userId === '' || userId === null) {
      return res.json({ success: false });
    }
    try {
      const freindrequest = await this.userService.freindrequest(userId);
      const friendIds = freindrequest.map((item) => item.userId);
      const friendsDetails = await Promise.all(
        friendIds.map((id) => this.userService.getUserbyId(id))
      );

      if (friendsDetails.length === 0) {
        return res.json({ success: true, friendsDetails: null, empty: true });
      }

      return res.json({ success: true, friendsDetails, empty: false });
    } catch (error: any) {
      console.error('Error getFriends:', error);
      return res.json({ success: false });
    }
  }

  @Get(':id/BlockedFriends')
  @UseGuards(JwtAuthGuard)
  async BlockedFriends(@Param('id') userId: string, @Res() res: any) {
    if (userId === undefined || userId === '' || userId === null) {
      return res.json({ success: false });
    }
    try {
      const BlockedFriends = await this.userService.BlockedFriends(userId);
      const friendIds = BlockedFriends.map((item) => item.friendId);
      const friendsDetails = await Promise.all(
        friendIds.map((id) => this.userService.getUserbyId(id))
      );

      return res.json({ success: true, friendsDetails });
    } catch (error: any) {
      console.error('Error getFriends:', error);
      return res.json({ success: false });
    }
  }

  @Put('/:userId/acceptFriend/:friendId')
  @UseGuards(JwtAuthGuard)
  async acceptFriendRequest(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
    @Res() res: any
  ) {
    if (userId === undefined || userId === '' || userId === null) {
      return res.json({ success: false });
    }
    try {
      const acceptFriendRequest = await this.userService.acceptFriendRequest(
        userId,
        friendId
      );
      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error accept Friend Request:', error);
      return res.json({ success: false });
    }
  }

  @Delete('/:userId/declineFriend/:friendId')
  @UseGuards(JwtAuthGuard)
  async declineFriendRequest(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
    @Res() res: any
  ) {
    if (userId === undefined || userId === '' || userId === null) {
      return res.json({ success: false });
    }
    if (friendId === undefined || friendId === '' || friendId === null) {
      return res.json({ success: false });
    }
    try {
      const declineFriendRequest = await this.userService.declineFriendRequest(
        userId,
        friendId
      );
      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error decline Friend Request:', error);
      return res.json({ success: false });
    }
  }

  @Get('/:userId/FriendshipStatus/:friendId')
  @UseGuards(JwtAuthGuard)
  async FriendshipStatus(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
    @Res() res: any
  ) {
    if (userId === undefined || userId === '' || userId === null) {
      return res.json({ success: false });
    }
    if (friendId === undefined || friendId === '' || friendId === null) {
      return res.json({ success: false });
    }

    try {
      const friend = await this.userService.FriendshipStatus(userId, friendId);
      return res.json({ success: true, friend });
    } catch (error: any) {
      console.error('Error FriendshipStatus:', error);
      return res.json({ success: false });
    }
  }
}
