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
	implements OnGatewayConnection, OnGatewayDisconnect
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
				this.connectedClients.set(client.id, jwt);
				// this.connectedClients.set(jwt, client.id);
			}
		}
	}
	removeClient(client: Socket) {
		this.connectedClients.delete(client.id);
	}

	@SubscribeMessage('FriendShipRequest')
	async handleFriendRequest(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: any
	) {
		// console.log('data : ', data);
		const { userId, friendId } = data;

		for (const [key, value] of this.connectedClients.entries()) {
			const user = await this.authService.getUserFromJwt(value);
			if (user.intraId === friendId) {
				// console.log('user : ', user.login);
				this.server.to(key).emit('FriendShipRequest');
			}
		}

		// this.server.emit('FriendShipRequest');
	}

	async handleConnection(client: Socket) {
		try {
			this.addClient(client);
			// this.printConnectedClients();
			if (client.handshake.auth && client.handshake.auth.jwt) {
				const user = await this.authService.getUserFromJwt(client.handshake.auth.jwt);
				// console.log('user connected : ', user.login, '\n');
				if (user) {
					this.server.emit('update');
					await this.UserService.updateUserState(user.intraId, 'ONLINE');
				}
			}
		} catch (error) {}
	}

	async handleDisconnect(client: Socket) {
		try {
			this.removeClient(client);
			if (client.handshake.auth && client.handshake.auth.jwt) {
				const user = await this.authService.getUserFromJwt(client.handshake.auth.jwt);
				// console.log('user disconnected ', user.login);
				if (user) {
					this.server.emit('update');
					await this.UserService.updateUserState(user.intraId, 'OFFLINE');
				}
			}
		} catch (error) {}
	}
}
