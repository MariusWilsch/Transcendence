// prisma.service.ts
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createMessage(sender: string, recipient: string, content: string): Promise<void> {
    const senderUser = await this.prisma.user.findUnique({ where: { intraId: sender } });
    const recipientUser = await this.prisma.user.findUnique({ where: { intraId: recipient } });
    if (!senderUser || !recipientUser) {
      // Handle the case where either sender or recipient does not exist
      throw new Error('Sender or recipient not found.');
    }

    await this.prisma.message.create({
      data: {
        sender,
        recipient,
        content,
      },
    });
  }

  async createPrivateRoom(user1: string, user2: string): Promise<void> {
    const member1 = await this.prisma.user.findUnique({ where: { intraId: user1 } });
    const member2 = await this.prisma.user.findUnique({ where: { intraId: user2 } });
    if (!member1 || !member2) {
      // Handle the case where either sender or recipient does not exist
      throw new Error('Sender or recipient not found.');
    }
    const romeName  = member1.intraId > member2.intraId ? member1.intraId + member2.intraId :member2.intraId + member1.intraId;
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

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
