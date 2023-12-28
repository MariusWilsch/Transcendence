import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, User } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  constructor() {}

  async getAllUsers() {
    try {
      const Users = await prisma.user.findMany({
        orderBy: {
          created_at: 'asc',
        },
      });

      return Users;
    } catch (e) {
      console.log('Error in getAllUsers: ', e);
    }
  }

  async getUserbyId(id: string) {
    try {
      const User = await prisma.user.findUnique({
        where: {
          intraId: id,
        },
      });

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

  async createFriend(userId: string, friendId: string): Promise<string> {
    const ifTheFriendshipExists = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    if (ifTheFriendshipExists) {
      await prisma.friend.deleteMany({
        where: {
          OR: [
            { userId: userId, friendId: friendId },
            { userId: friendId, friendId: userId },
          ],
        },
      });
      return 'alreadyFriend';
    }

    const friend = await prisma.friend.create({
      data: {
        friendshipStatus: 'PENDING',
        userId: userId,
        friendId: friendId,
      },
    });
    return 'newFriendship';
  }

  async blockFriend(userId: string, friendId: string): Promise<string> {
    const ifTheFriendshipExists = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
    if (ifTheFriendshipExists) {
      await prisma.friend.deleteMany({
        where: {
          OR: [
            { userId: userId, friendId: friendId },
            { userId: friendId, friendId: userId },
          ],
        },
      });
      return 'alreadyFriend';
    }

    const friend = await prisma.friend.create({
      data: {
        friendshipStatus: 'BLOCKED',
        userId: userId,
        friendId: friendId,
      },
    });
    return 'newFriendship';
  }

  async getFriends(userId: string) {
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          { userId: userId, friendshipStatus: 'ACCEPTED' },
          { friendId: userId, friendshipStatus: 'ACCEPTED' },
        ],
      },
    });
    const userIds = friends.map((item) => item.userId);
    const friendIds = friends.map((item) => item.friendId);

    const friendsDetails = await Promise.all(
      friendIds.map((id) => this.getUserbyId(id))
    );
    const uesrsDetails = await Promise.all(
      userIds.map((id) => this.getUserbyId(id))
    );

    const filteredFriendsDetails = [...uesrsDetails, ...friendsDetails].filter(
      (friend) => friend.intraId !== userId
    );

    return filteredFriendsDetails;
  }

  async getonlineFriends(userId: string) {
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          { userId: userId, friendshipStatus: 'ACCEPTED' },
          { friendId: userId, friendshipStatus: 'ACCEPTED' },
        ],
      },
    });
    const userIds = friends.map((item) => item.userId);
    const friendIds = friends.map((item) => item.friendId);

    const friendsDetails = await Promise.all(
      friendIds.map((id) => this.getUserbyId(id))
    );
    const uesrsDetails = await Promise.all(
      userIds.map((id) => this.getUserbyId(id))
    );

    const filteredFriendsDetails = [...uesrsDetails, ...friendsDetails].filter(
      (friend) => friend.intraId !== userId && friend.status === 'ONLINE'
    );

    return filteredFriendsDetails;
  }

  async PendingInvite(userId: string) {
    const PendingInvite = await prisma.friend.findMany({
      where: {
        userId: userId,
        friendshipStatus: 'PENDING',
      },
    });

    return PendingInvite;
  }

  async BlockedFriends(userId: string) {
    const BlockedFriends = await prisma.friend.findMany({
      where: {
        userId: userId,
        friendshipStatus: 'BLOCKED',
      },
    });

    return BlockedFriends;
  }

  async freindrequest(userId: string) {
    const freindrequest = await prisma.friend.findMany({
      where: {
        friendId: userId,
        friendshipStatus: 'PENDING',
      },
    });

    return freindrequest;
  }

  async acceptFriendRequest(userId: string, friendId: string) {
    try {
      const friend = await prisma.friend.update({
        where: {
          unique_user_friend: {
            userId: friendId,
            friendId: userId,
          },
        },
        data: {
          friendshipStatus: 'ACCEPTED',
        },
      });
      return friend;
    } catch (error: any) {
      console.error('Error accept Friend Request:', error);
      return;
    }
  }

  async declineFriendRequest(userId: string, friendId: string) {
    try {
      const friend = await prisma.friend.delete({
        where: {
          unique_user_friend: {
            userId: friendId,
            friendId: userId,
          },
        },
      });
      return friend;
    } catch (error: any) {
      console.error('Error decline Friend Request:', error);
      return;
    }
  }

  async getUsersbyInput(input: string) {
    try {
      const Users = await prisma.user.findMany({
        where: {
          login: {
            contains: input,
          },
        },
      });

      return Users;
    } catch (error: any) {
      console.error('Error getUsersbyInput:', error);
      return;
    }
  }

  async updateUserState(
    userId: string,
    status: 'ONLINE' | 'OFFLINE' | 'INGAME'
  ) {
    try {
      const friend = await prisma.user.update({
        where: {
          intraId: userId,
        },
        data: {
          status: status,
        },
      });
    } catch (error: any) {
      console.error('Error updateUserState:', error);
      return;
    }
  }

  async FriendshipStatus(userId: string, friendId: string) {
    const FriendshipStatus = await prisma.friend.findFirst({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
    return FriendshipStatus;
  }
}
