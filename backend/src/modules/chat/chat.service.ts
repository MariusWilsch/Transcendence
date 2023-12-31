import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { User, Room, Message } from './dto/chat.dto';
@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) { }

  async sendPrivateMessage(sender: string, recipient: string, message: string): Promise<void> {
    // Additional business logic if needed
    await this.prismaService.createMessage(sender, recipient, message);
  }
  async getAllPrivateRooms(): Promise<any> {
    const data = await this.prismaService.getAllRooms();
    return data;
  }
  async getPrivateRoom(roomId: string) {
    const data = await this.prismaService.getRoom(roomId);
    return data;
  }
  async getPrivateRoomsByUser(userId:string)
  {
    // const data = await this.prismaService.createMessage();
  }
  async getPrivateRoomMessages(roomId: string){
    const room = await this.getPrivateRoom(roomId);
    if (!room)
    {
      throw ('no such room');
    }
    const data = await this.prismaService.getRoomMessages(roomId);
    return data;
  }
  async getMessagesByUser(userId:string): Promise<any>{
    const data = await this.prismaService.getMessagesByUser(userId);
    return data;
  }
}
