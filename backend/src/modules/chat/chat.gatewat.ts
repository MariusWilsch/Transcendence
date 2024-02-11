// chat.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect,  } from '@nestjs/websockets';
import { Server} from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from 'modules/auth/auth.service';


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
      private authService: AuthService,
      ) {}

  @WebSocketServer() server: Server;

  private connectedClients = new Map<string, any>();

  handleConnection(client: any): void {
    if (client.handshake.query.user === undefined)return;
    const user = this.authService.getUserFromJwtstatic(client.handshake.query.user);
    if (user)
    {
      this.chatService.updateUserStatus(user.intraId, 'ONLINE');
      client.user = user;
      if (this.connectedClients.has(user.intraId))
      {
        this.connectedClients.get(user.intraId).push(client);
      }
      else{
        this.connectedClients.set(user.intraId, [client]);
      }

    }
    // else console.log('you should authenticated first');
  }
  
  handleDisconnect(client: any): void {
    if (client.user){
      this.chatService.updateUserStatus(client.user.intraId, 'OFFLINE');
    }
    this.connectedClients.delete(client.id);
  }

  getAllSocketsByUserId(userId: string): any | [] {
    return this.connectedClients.get(userId) || [];
  }


  @SubscribeMessage('createPrivateRoom')
  async createPrivRoom(client :any, payload:{jwt:string, user2:string, clientRoomid:string}): Promise<void>{
    try{
      const user = this.authService.getUserFromJwtstatic(payload.jwt);
      if (!user)
      {
        return;
      }
      await this.chatService.createPrivateRoom(client.user.intraId, payload.user2, payload.clientRoomid);
    }
    catch(e){
      client.emit('createPrivateRoom', {e})
    }
  }

  @SubscribeMessage('privateChat')
  async handlePrivateChat(client: any, payload: { to: string, message: string, jwt:string}): Promise<void> {
    try{
      const user = this.authService.getUserFromJwtstatic(payload.jwt);
      if (!user)
      {
        return;
      }
      const recipientSocket = this.getAllSocketsByUserId(payload.to);
      const senderSocket = this.getAllSocketsByUserId(user.intraId);
      if (recipientSocket) {
        
        const message = await this.chatService.createMessage(user.intraId, payload.to, payload.message);
        recipientSocket.map((socket:any) =>{
          socket.emit('privateChat',message);
          socket.emit('messageNotification',{data:user.login});
      });
        senderSocket.map((socket:any) =>{
          if (client.id != socket.id)
          {
            socket.emit('privateChat',message);
          }
        })
      } else {
        client.emit('error', { message: 'Recipient not found.' });
      }
    }
    catch(e){
      // console.log(e);
    }
  }

  @SubscribeMessage('channelBroadcast')
  async handleChannelChat(client:any, payload:{to:string,message:string, jwt:string}): Promise<void> {
    try{
      const user = this.authService.getUserFromJwtstatic(payload.jwt);
      if (!user)
      {
        return;
      }
      const members = await this.chatService.getAllChannelUsers(payload.to);
      const message = await this.chatService.createChannelMessage(payload.to, payload.message,user);
      let blockedUsers = await this.chatService.getBlockedUser(user.intraId);
      members.map((member)=>{
        if (!member.isBanned && !blockedUsers.some((entry) => {
          if (entry.userId === user.intraId) {
            return entry.friendId === member.intraId;
          } else if (entry.friendId === user.intraId) {
            return entry.userId === member.intraId;
          }
          return false; // Make sure to have a default return value
        }))
        {
          const recipientSocket = this.getAllSocketsByUserId(member.intraId);
          recipientSocket.map((socket:any) =>{
            if (socket.id !== client.id){
              socket.emit('channelBroadcast',message);
            }
          }
          );
        }
      })
    }
    catch(e){
      // console.log(e);
      client.emit('channelBroadcast', {e});
    }
  }

  @SubscribeMessage('updateChannelUser')
  async updateChannel(client:any, payload:{jwt:string, memberId:string, info:{userPrivilige:boolean, banning:boolean, Muting:{action:boolean, time:Date}}}){
    try{
      const user = this.authService.getUserFromJwtstatic(payload.jwt);
      if (!user)
      {
        return;
      }
      const memberShip = await this.chatService.updateChannelUser(user.intraId, payload.memberId,payload.info);
      client.emit('updateChannelUser',{e:"member Successufely updated"});
      const socketRec = this.getAllSocketsByUserId(memberShip.intraId);
      socketRec.map((socket:any)=>{
        socket.emit('updateChannelUser', {e:`your memberShip at the channel ${memberShip.channelName} has been updated`});
      })
    }
    catch(e){
      // console.log(e);
        client.emit('updateChannelUser',{e});
    }
  }
  @SubscribeMessage('privateMatch')
  async privateMatch(client:any, payload:{to:string, other:string,jwt:string}){
    const user = this.authService.getUserFromJwtstatic(payload.jwt);
    if (!user)
    {
      return;
    }
    const friendSocket = this.getAllSocketsByUserId(payload.other);
    friendSocket.map((socket:any)=>{
      socket.emit('privateMatch', {from:client.user});
    })
  }
}
