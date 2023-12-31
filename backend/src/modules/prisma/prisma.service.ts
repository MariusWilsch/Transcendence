// prisma.service.ts
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

type User = {
  intraId: string;
  fullname: string;
  login: string;
  email: string;
  Avatar: string;
  created_at: Date;
  updated_at: Date;
};

type Room = {
  id :number
  name:string
  participantsIds: string[]
  participants : User[]
  messages     : any[]
  createdAt    : string
  updated_at   : string
}
@Injectable()
export class PrismaService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createMessage(sender: string, recipient: string, content: string): Promise<void> {
    const senderUser = await this.prisma.user.findUnique({ where: { intraId: sender } });
    const recipientUser = await this.prisma.user.findUnique({ where: { intraId: recipient } });
    const privateRoomName = parseInt(senderUser.intraId) > parseInt(recipientUser.intraId) ? senderUser.intraId + recipientUser.intraId :recipientUser.intraId + senderUser.intraId;
    const room = await this.prisma.privateRoom.findUnique({
      where:{
        name:privateRoomName,
      }
    });
    if (!senderUser || !recipientUser) {
      // Handle the case where either sender or recipient does not exist
      throw new Error('Sender or recipient not found.');
    }
    if (!room)
    {
      throw('no such channel');
    }
    await this.prisma.message.create({
      data: {
        sender:sender,
        recipient:recipient,
        content:content,
        PrivateRoomName:privateRoomName,
      },
    });
  }

  async createPrivateRoom(user1: string, user2: string): Promise<void> {

    const romeName  = parseInt(user1) > parseInt(user2) ? user1 + user2 :user2 + user1;

    const room = await this.prisma.privateRoom.findUnique({
      where:{
        
        name:romeName,
      }
    });
    if (room)
    {
      console.log('room already exist');
      return;
    }
    const member1 = await this.prisma.user.findUnique({ where: { intraId: user1 } });
    const member2 = await this.prisma.user.findUnique({ where: { intraId: user2 } });
    if (!member1 || !member2) {
      // Handle the case where either sender or recipient does not exist
      throw new Error('Sender or recipient not found.');
    }
    await this.prisma.privateRoom.create({
      data: {
        name:romeName,
        participantsIds:[member1.intraId, member2.intraId],
      },
    });
  }

  async getMessagesByUser(userId: string): Promise<any[]> {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { sender: userId },
          { recipient: userId },
        ],
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // You can add other methods for more database operations as needed
  async getAllMessages(): Promise<any[]> {
    return this.prisma.message.findMany();
  }
  //get user by id
  async getUserById(userId: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: {
        intraId: userId,
      },
    });
  }
  //get all users
  async getAllUsers(): Promise<any[]> {
    return this.prisma.user.findMany();
  }

  async getAllRooms() {
    try {
      const rooms = await this.prisma.privateRoom.findMany({
        orderBy: {
          updated_at: 'asc',
        },
      });

      return rooms;
    } catch (e) {
      console.log('Error in getAllRooms: ', e);
    }
  }
  async getRoom(roomId:string) :Promise<any>{
    return await this.prisma.privateRoom.findUnique({
      where: {
        name: roomId,
      },
    });
  }
  async getRoomMessages(roomId:string) :Promise<any>{
    return await this.prisma.message.findMany({
      where:{
        PrivateRoomName:roomId,
      },
      orderBy:{
        createdAt:'asc',
      }
    })
  }
  async getRoomsByUser(userId:string)
  {
  }
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
