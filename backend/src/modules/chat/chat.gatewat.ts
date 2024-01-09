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
    constructor(
      private readonly chatService: ChatService,
      ) {}

  @WebSocketServer() server: Server;

  private connectedClients = new Map<string, any>();

  handleConnection(client: any): void {
    const user = this.chatService.getUserFromJwt(client.handshake.query.user);
    if (user)
    {
      console.log(`Client connected: ${user.intraId}`);
      if (this.connectedClients.has(user.intraId))
      {
        this.connectedClients.get(user.intraId).push(client);
      }
      else{
        this.connectedClients.set(user.intraId, [client]);
      }

    }
  }
  
  handleDisconnect(client: any): void {
    console.log(`Client connected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  // handleConnection(client:any ) {
  //   // Get the user ID from the socket connection
  //   const userId = client.handshake.query.userId;

  //   // Store the socket in the connectedSockets map
  //   if (userId) {
  //     if (this.connectedClients.has(userId)) {
  //       this.connectedClients.get(userId).push(client);
  //     } else {
  //       this.connectedClients.set(userId, [client]);
  //     }
  //   }
  // }

  // handleDisconnect(client: any) {
  //   // Remove the disconnected socket from the connectedSockets map
  //   for (const [userId, sockets] of this.connectedClients.entries()) {
  //     const index = sockets.indexOf(client);
  //     if (index !== -1) {
  //       sockets.splice(index, 1);
  //       if (sockets.length === 0) {
  //         this.connectedClients.delete(userId);
  //       }
  //       break;
  //     }
  //   }
  // }
  getAllSocketsByUserId(userId: string): any | [] {
    return this.connectedClients.get(userId) || [];
  }
  @SubscribeMessage('createPrivateRoom')
  async createPrivRoom(client :any, payload:{user1:string, user2:string}): Promise<void>{
    console.log(`this is he first user ${payload.user1}`);
    console.log(`this is he second user ${payload.user2}`);
    await this.chatService.createPrivateRoom(payload.user1, payload.user2);
  }
  @SubscribeMessage('privateChat')
  async handlePrivateChat(client: any, payload: { to: string, message: string, senderId:string}): Promise<void> {
    const recipientSocket = this.getAllSocketsByUserId(payload.to);
    const senderSocket = this.getAllSocketsByUserId(payload.senderId);
    // const recip = await this.chatService.getUserById(payload.to);
    // console.log(recip):
    if (recipientSocket) {

      const message = await this.chatService.createMessage(payload.senderId, payload.to, payload.message);
          recipientSocket.map((socket:any) =>socket.emit('privateChat',message));
          senderSocket.map((socket:any) =>{
            if (client.id != socket.id)
            {
              socket.emit('privateChat',message);
            }
          })
        // Save the private message to the database
        console.log(`Private message from ${payload.senderId} to ${payload.to}: ${message.content}`);
      } else {
        client.emit('error', { message: 'Recipient not found or offline.' });
      }
  }
  @SubscribeMessage('createChannel')
  async createChannel(client :any, payload:{owner:string,name:string, typePass:{type:string, password:string}}){
    try{
      await this.chatService.createChannel(payload.owner, payload.name, payload.typePass);
    }
    catch(e){
      client.emit(e);
    }
  }
  @SubscribeMessage('JoinAChannel')
  async joinChannel(client:any, payload:{}){

  }
}