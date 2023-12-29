// chat.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from 'modules/prisma/prisma.service';
import { User } from './dto/chat.dto';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    // chat.gateway.ts
    constructor(private readonly prismaService: PrismaService) {}

  @WebSocketServer() server: Server;

  private connectedClients = new Map<string, any>();

  handleConnection(client: any): void {
    const userId = client.handshake.query.userId
    console.log(`Client connected: ${userId}`);
    this.connectedClients.set(userId, client);
  }
  
  handleDisconnect(client: any): void {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('createPrivateRoom')
  async createPrivRoom(client :any, payload:{user1:string, user2:string}): Promise<void>{
    await this.prismaService.createPrivateRoom(payload.user1, payload.user2);
  }
  @SubscribeMessage('privateChat')
  async handlePrivateChat(client: any, payload: { to: string, message: string, senderId:string}): Promise<void> {
    const recipientSocket = this.connectedClients.get(payload.to);
    const recip = await this.prismaService.getUserById(payload.to);
    console.log(recip);
    if (recipientSocket || recip) {
      if (recipientSocket)
      {
        recipientSocket.emit('privateChat', { sender: payload.senderId,content: payload.message,senderLogin:payload.senderId });
      }
        // Save the private message to the database
        await this.prismaService.createMessage(payload.senderId, payload.to, payload.message);
        console.log(`Private message from ${payload.senderId} to ${payload.to}: ${payload.message}`);
      } else {
        client.emit('error', { message: 'Recipient not found or offline.' });
      }
  }
}
