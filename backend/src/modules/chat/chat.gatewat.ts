// chat.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from 'modules/prisma/prisma.service';

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
    console.log(client);
    this.connectedClients.set(client.id, client);
  }

  handleDisconnect(client: any): void {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('privateChat')
  async handlePrivateChat(client: any, payload: { to: string, message: string }): Promise<void> {
    const recipientSocket = this.connectedClients.get(payload.to);
    if (recipientSocket) {
        recipientSocket.emit('privateChat', { sender: client.id, message: payload.message });
    
        // Save the private message to the database
        await this.prismaService.createMessage(client.id, payload.to, payload.message);
        console.log(`Private message from ${client.id} to ${payload.to}: ${payload.message}`);
      } else {
        client.emit('error', { message: 'Recipient not found or offline.' });
      }
  }
}
