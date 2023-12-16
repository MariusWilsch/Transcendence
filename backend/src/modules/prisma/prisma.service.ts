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
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
