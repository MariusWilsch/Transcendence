import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket as IO } from 'socket.io';
import {
	GameState,
	GameSession,
	PlayerMove,
	GameConfigState,
	AiDifficulty,
} from './helpers/interfaces';
import { GameService } from './game.service';
import { v4 as uuidv4 } from 'uuid';
import { GAME_CONFIG } from './helpers/game.constants';
import { AuthService } from 'modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'modules/user/user.service';

@WebSocketGateway({
	cors: {
		origin: `${process.env.URL}:3000`,
	},
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private gameService: GameService,
		private authService: AuthService,
		private userService: UserService
	) {}

	@WebSocketServer() Server: Server;
	lobby: IO[] = [];
	aiLobby: IO[] = [];
	privateLobby = new Map<string, IO>();
	duplicateUsers: Set<string> = new Set();

	handleConnection(client: IO) {
		// console.log(`Client connected via ${client.id}`);
		//* If the client is not authenticated, disconnect him
		if (!client.handshake.auth.token) {
			// console.log('Client not authenticated');
			return client.disconnect(true);
		}
		this.checkForDuplicateUsers(client);
	}

	checkForDuplicateUsers(client: IO) {
		const user = this.authService.getUserFromJwtstatic(
			client.handshake.auth.token
		);
		if (!user) return ;
		if (this.duplicateUsers.has(user.intraId)) {
			// console.log('Duplicate user detected');
			client.emit('duplicateRequest');
			return ;
		}
		this.duplicateUsers.add(user.intraId);
		client.data = {
			user: {
				intraId: user.intraId,
			},
		};
		client.emit('connectionSuccess');
	}

	handleDisconnect(client: IO) {
		this.lobby = this.lobby.filter((player) => player.id !== client.id);
		// console.log(`Client disconnected via ${client.id}`);
		// If the client was in a running game clear the interval
		const roomID = client.data.roomID;
		if (this.gameService.hasRoom(roomID))
			this.gameService.deleteGameSession(client.id, roomID);
		if (this.gameService.isInGame(roomID)) {
			// console.log('Client was in a running game, clearing interval');
			clearInterval(this.gameService.getIntervalID(roomID));
		}
		// console.log(client.data);
		if (client.data.user) {
			this.duplicateUsers.delete(client.data.user.intraId);
			this.userService.updateUserState(client.data.user.intraId, 'ONLINE');
		}
	}

	checkForAvailablePlayers(lobbyType: 'aiLobby' | 'lobby') {
		const lobby = this[lobbyType];
		if (lobby.length < 2) return;
		const player1 = lobby.shift();
		const player2 = lobby.shift();
		// console.log('Match found --> calling `createGame function`');
		this.createGame(player1, player2);
	}

	async createGame(player1: IO, player2: IO) {
		// Generate a room ID
		const roomID = uuidv4();

		const user1 = await this.authService.getUserFromJwt(
			player1.handshake.auth.token
		);
		const user2 = await this.authService.getUserFromJwt(
			player2.handshake.auth.token
		);

		const userData: GameSession['userData'] = [
			{
				avatar: user1.Avatar,
				username: user1.login,
			},
			{
				avatar: user2.Avatar,
				username: user2.login,
			},
		];

		// Change the username and avatar if the game is against AI
		if (player1.data.user.intraId === player2.data.user.intraId) {
			// console.log('AI game detected, user1 needs AI Avatar and username');
			userData[0].username = 'Computer';
		}

		// Create a new game session and store it in the Map
		this.gameService.createGameSession(roomID, player1, player2, userData);

		// Emit an event to both Sockets in the room
		const gameState = this.gameService.getGameState(roomID);
		this.Server.to(roomID).emit('createGame', {
			...gameState,
			canvasWidth: GAME_CONFIG.canvasWidth,
			canvasHeight: GAME_CONFIG.canvasHeight,
			userData,
		});
	}

	beginGameLoop(roomID: string) {
		let lastTime = performance.now();

		// console.log('Game loop started');

		const intervalId = setInterval(() => {
			const currentTime = performance.now();
			const deltaTime = (currentTime - lastTime) / 1000;
			lastTime = currentTime;
			const gameSession = this.gameService.getSession(roomID);
			if (!gameSession) return clearInterval(intervalId);

			// if (!this.gameService.updateGameState(gameSession, deltaTime)) {
			// 	gameSession.players[0].playerSockets.disconnect(true);
			// }

			this.gameService.updateGameState(gameSession, deltaTime);

			if (this.gameService.isGameOver(gameSession.gameState)) {
				// console.log('Game over, clearing interval');
				clearInterval(intervalId);
				this.userService.updateUserState(
					gameSession.players[0].playerSockets.data.user.intraId,
					'ONLINE'
				);
				this.userService.updateUserState(
					gameSession.players[1].playerSockets.data.user.intraId,
					'ONLINE'
				);
				if (gameSession.aiMatch) {
					const res =
						gameSession.gameState.score.player1 === GAME_CONFIG.WinningScore
							? 1
							: 0;
					gameSession.players[0].playerSockets.emit('gameOver', res);
					return;
				}
				const gameResult = this.gameService.getWinner(
					gameSession.players,
					gameSession.gameState
				);
				if (gameSession.aiMatch) return;
				gameSession.players[0].playerSockets.emit(
					'gameOver',
					gameResult.result[0]
				);
				gameSession.players[1].playerSockets.emit(
					'gameOver',
					gameResult.result[1]
				);
				this.gameService
					.saveMatchResult(
						gameSession,
						gameResult.winnerId,
						gameResult.loserId,
						gameResult.score
					)
					.catch((error) => {
						console.error('Error saving match result:', error);
					});
			}
			this.sendGameState(roomID, gameSession.gameState);
		}, 1000 / 60); //! Run the loop at approximately 60 FPS or try 25/30 FPS like ALII suggested

		this.gameService.setIntervalID(roomID, intervalId);
	}

	//! Optimization ideas
	sendGameState(roomID: string, gameState: GameState) {
		this.Server.to(roomID).emit('gameState', gameState);
	}

	@SubscribeMessage('onPaddleMove')
	handlePaddleMove(client: IO, payload: PlayerMove): void {
		const gameSession: GameSession = this.gameService.getSession(
			client.data.roomID
		);

		// Notify game service of the paddle move
		this.gameService.setKeyboardInput(
			gameSession.input[client.data.playerID],
			payload
		);
		// console.log('onPaddleMove event received', payload);
	}

	@SubscribeMessage('onMouseMove')
	handleMouseMove(client: IO, payload: any): void {
		const gameSession: GameSession = this.gameService.getSession(
			client.data.roomID
		);
		if (!gameSession) return;
		// Notify game service of the paddle move
		this.gameService.setMouseInput(
			gameSession.input[client.data.playerID],
			payload
		);
	}

	@SubscribeMessage('setupInteraction')
	handleSetupInteraction(client: IO, payload: GameConfigState): void {
		// console.log('Client playerID', client.data.playerID);
		// console.log("Client's gameConfigState", payload.inputType);
		this.gameService.setCommand(
			payload,
			this.gameService.getSession(client.data.roomID),
			client.data.playerID
		);
	}

	@SubscribeMessage('startLoop')
	handleStartLoop(client: IO): void {
		this.gameService.checkCommands(client.data.roomID);
		if (this.gameService.isInGame(client.data.roomID)) return;
		const gameSession = this.gameService.getSession(client.data.roomID);
		this.userService.updateUserState(
			gameSession.players[0].playerSockets.data.user.intraId,
			'INGAME'
		);
		this.userService.updateUserState(
			gameSession.players[1].playerSockets.data.user.intraId,
			'INGAME'
		);
		this.beginGameLoop(client.data.roomID);
	}

	@SubscribeMessage('cancelMatchmaking')
	handleCancelMatchmaking(client: IO) {
		this.lobby = this.lobby.filter((player) => player.id !== client.id);
		// console.log(
		// 	`Client ${client.id} removed from matchmaking. New lobby size: ${this.lobby.length}`
		// );
	}

	@SubscribeMessage('invitePrivate')
	handlePrivateGame(client: IO, payload: any): void {
		// console.log('invitePrivate event received', payload);
		this.privateLobby.set(payload.inviteeID, client);
	}

	@SubscribeMessage('acceptPrivate')
	handleAcceptPrivate(client: IO, payload: any): void {
		// console.log('acceptPrivate event received', payload);
		if (payload.accepted === false) {
			this.privateLobby.delete(payload.inviteeID);
			return;
		}

		if (!this.privateLobby.has(payload.inviteeID))
			return // console.log('No such invite');
		// console.log('Match found --> calling `createGame function`');
		this.createGame(client, this.privateLobby.get(payload.inviteeID));
		this.privateLobby.delete(payload.inviteeID);
	}

	@SubscribeMessage('addToLobby')
	handleAddToLobby(client: IO, payload: AiDifficulty): void {
		const lobbyType = payload === AiDifficulty.NONE ? 'lobby' : 'aiLobby';
		this[lobbyType].push(client);
		// console.log(
		// 	`Client ${client.id} added to matchmaking. New ${lobbyType} size: ${this[lobbyType].length}`
		// );
		this.checkForAvailablePlayers(lobbyType);
	}

	@SubscribeMessage('sendCtxDimensions')
	handleSendCtxDimensions(client: IO, payload: any): void {
		// console.log('sendCtxDimensions event received', payload);
		client.data.roomID = payload.roomID;
		client.data.playerID = payload.playerID;
	}
}
