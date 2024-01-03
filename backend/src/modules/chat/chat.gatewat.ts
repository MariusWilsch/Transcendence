// chat.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from 'modules/prisma/prisma.service';
import { ChatService } from './chat.service';
import { User } from './dto/chat.dto';

@WebSocketGateway(3002,{
  namespace:'chat',
    cors: {
        origin: `${process.env.URL}:3000`,
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    // chat.gateway.ts
    constructor(private readonly chatService: ChatService) {}

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
    console.log(`this is he first user ${payload.user1}`);
    console.log(`this is he second user ${payload.user2}`);
    await this.chatService.createPrivateRoom(payload.user1, payload.user2);
  }
  @SubscribeMessage('privateChat')
  async handlePrivateChat(client: any, payload: { to: string, message: string, senderId:string}): Promise<void> {
    const recipientSocket = this.connectedClients.get(payload.to);
    const recip = await this.chatService.getUserById(payload.to);
    console.log(recip);
    if (recipientSocket || recip) {
      if (recipientSocket)
      {
        recipientSocket.emit('privateChat', { sender: payload.senderId,content: payload.message,senderLogin:payload.senderId });
      }
        // Save the private message to the database
        await this.chatService.createMessage(payload.senderId, payload.to, payload.message);
        console.log(`Private message from ${payload.senderId} to ${payload.to}: ${payload.message}`);
      } else {
        client.emit('error', { message: 'Recipient not found or offline.' });
      }
  }
}
