import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async sendPrivateMessage(sender: string, recipient: string, message: string): Promise<void> {
    // Additional business logic if needed
    await this.prismaService.createMessage(sender, recipient, message);
  }
}