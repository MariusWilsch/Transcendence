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
  addClient(client: Socket) {
    const jwt = client.handshake.auth.jwt as string;
    if (jwt && client.id) {
      if (!this.connectedClients.has(client.id)) {
        this.connectedClients.set(client.id, jwt);
      }
    }
  }
  removeClient(client: Socket) {
    this.connectedClients.delete(client.id);
  }
  //===========================================================

  private logger: Logger = new Logger('handle Clients Connection Gateway Log');

  afterInit(server: Server) {
    console.log('handleClientsConnection server initialized');
    // this.logger.log('APP server Initialized!');
  }

  async handleConnection(client: Socket) {
    try {
      this.addClient(client);
      if (client.handshake.auth && client.handshake.auth.jwt) {
        const user = this.authService.getUserFromJwt(client.handshake.auth.jwt);
        // console.log('user connected ', user.login);
        if (user) {
          this.server.emit('update');

          await this.UserService.updateUserState(user.intraId, 'ONLINE');
          // this.logger.log(`${user.login} connected`);
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
          // this.logger.log(`${user.login} disconnected`);
        }
      }
    } catch (error) {
      // this.logger.error('Error in handleDisconnect:', error);
    }
  }
}
