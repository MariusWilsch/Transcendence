import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { UserService } from 'modules/user/user.service';
import { AuthService } from 'modules/auth/auth.service';

@WebSocketGateway(3002, {
  namespace: 'handleClientsConnection',
  cors: {
    origin: `${process.env.URL}:3000`,
  },
})
export class handleClientsConnection
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private UserService: UserService,
    private authService: AuthService
  ) {}

  @WebSocketServer()
  server: Server;

  //================================================================
  private connectedClients: Map<string, string> = new Map();

  // printConnectedClients = () => {
  //   console.log('|| => connected clients: ');
  //   for (const [key, value] of this.connectedClients.entries()) {
  //     const user = this.authService.getUserFromJwt(key);
  //     console.log('login :', user.login);
  //     console.log('socket Id :', value);
  //   }

  //   console.log('=====================\n');
  // };

  addClient(client: Socket) {
    const jwt = client.handshake.auth.jwt as string;
    if (jwt && client.id) {
      if (!this.connectedClients.has(client.id)) {
        // this.connectedClients.set(client.id, jwt);
        this.connectedClients.set(jwt, client.id);
      }
    }
  }
  removeClient(client: Socket) {
    this.connectedClients.delete(client.id);
  }
  //===========================================================

  // private logger: Logger = new Logger('handle Clients Connection Gateway Log');

  afterInit(server: Server) {
    console.log('handleClientsConnection server initialized');
    // this.logger.log('APP server Initialized!');
  }

  @SubscribeMessage('FriendShipRequest')
  handleFriendRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any
  ) {
    // notify other clients about this new user
    this.server.emit('FriendShipRequest');
    // console.log('FriendShipRequest : ', data);
  }

  async handleConnection(client: Socket) {
    try {
      this.addClient(client);
      // this.printConnectedClients();
      if (client.handshake.auth && client.handshake.auth.jwt) {
        const user = this.authService.getUserFromJwt(client.handshake.auth.jwt);
        // console.log('user connected : ', user.login, '\n');
        if (user) {
          this.server.emit('update');
          await this.UserService.updateUserState(user.intraId, 'ONLINE');
        }
      }
    } catch (error) {
      // this.logger.error('Error in handleConnection:', error);
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      this.removeClient(client);
      if (client.handshake.auth && client.handshake.auth.jwt) {
        const user = this.authService.getUserFromJwt(client.handshake.auth.jwt);
        // console.log('user disconnected ', user.login);
        if (user) {
          this.server.emit('update');
          await this.UserService.updateUserState(user.intraId, 'OFFLINE');
        }
      }
    } catch (error) {
      // this.logger.error('Error in handleDisconnect:', error);
    }
  }
}
