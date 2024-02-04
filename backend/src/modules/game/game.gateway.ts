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
} from './helpers/interfaces';
import { GameService } from './game.service';
import { v4 as uuidv4 } from 'uuid';
import { GAME_CONFIG } from './helpers/game.constants';
import { AuthService } from 'modules/auth/auth.service';
import { PrismaClient } from '@prisma/client';
import { URL } from '../auth/constants'

const prisma = new PrismaClient();


@WebSocketGateway({
	cors: {
		origin: `${URL}:3000`,
	},
	// namespace: '/gamelobby/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private gameService: GameService,
		private authService: AuthService
	) {}

	@WebSocketServer() Server: Server;
	lobby: IO[] = [];
	privateLobby = new Map<string, IO>();
	duplicateUsers: Set<string> = new Set();

	async handleConnection(client: IO) {
		//! Identify the client not by token but by his username
		console.log(`Client connected via ${client.id}`);
		if (!client.handshake.auth.token) return;
		const id  = await this.authService.getUserFromJwt(
			client.handshake.auth.token
		);
		console.log(id.intraId)
		if (this.duplicateUsers.has(id)) {
			console.log('Duplicate user detected');
			client.emit('duplicateRequest');
			client.disconnect(true);
		}
		this.duplicateUsers.add(id);
	}

	async handleDisconnect(client: IO) {
		this.lobby = this.lobby.filter((player) => player.id !== client.id);
		console.log(`Client disconnected via ${client.id}`);
		// If the client was in a running game clear the interval
		const roomID = client.data.roomID;
		if (this.gameService.hasRoom(roomID))
			this.gameService.deleteGameSession(client.id, roomID);
		if (this.gameService.isInGame(roomID)) {
			console.log('Client was in a running game, clearing interval');
			clearInterval(this.gameService.getIntervalID(roomID));
		}
		this.duplicateUsers.delete(
			await this.authService.getUserFromJwt(client.handshake.auth.token)
		);
	}

	checkForAvailablePlayers() {
		if (this.lobby.length < 2) return;
		const player1 = this.lobby.shift();
		const player2 = this.lobby.shift();
		console.log('Match found --> calling `createGame function`');
		this.createGame(player1, player2);
	}

	async createGame(player1: IO, player2: IO) {
		// Generate a room ID
		const roomID = uuidv4();

		const user1 = await this.authService.getUserFromJwt(player1.handshake.auth.token);
		const user2 = await  this.authService.getUserFromJwt(player2.handshake.auth.token);


		console.log('user1 avatar', user1.Avatar);
		console.log('user2 avatar', user2.Avatar);

		// Create a new game session and store it in the Map
		this.gameService.createGameSession(roomID, player1, player2, user1, user2);

		// Emit an event to both Sockets in the room
		const gameState = this.gameService.getGameState(roomID);
		this.Server.to(roomID).emit('createGame', {
			...gameState,
			canvasWidth: GAME_CONFIG.canvasWidth,
			canvasHeight: GAME_CONFIG.canvasHeight,
			userData: [
				{
					avatar: user1.Avatar,
					username: user1.login,
				},
				{
					avatar: user2.Avatar,
					username: user2.login,
				},
			],
		});
	}

	beginGameLoop(roomID: string) {
		//! or https://www.thecodeship.com/web-development/alternative-to-javascript-evil-setinterval/
		//! try out https://github.com/timetocode/node-game-loop
		//! or https://www.npmjs.com/package/node-gameloop?activeTab=code or https://github.com/norlin/node-gameloop/tree/master/lib
		let lastTime = performance.now();

		console.log('Game loop started');
		const intervalId = setInterval(() => {
			const currentTime = performance.now();
			const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
			lastTime = currentTime;
			const gameSession = this.gameService.getSession(roomID);
			if (!gameSession) return;

			// if (deltaTime > 0.02) {
			// 	console.log(`High Delta Time Detected: ${deltaTime}`);
			// }

			// const startUpdateTime = performance.now();
			this.gameService.updateGameState(gameSession, deltaTime);
			// const endUpdateTime = performance.now();

			// console.log(
			// 	`Game state update took ${endUpdateTime - startUpdateTime} milliseconds`
			// );

			if (this.gameService.isGameOver(gameSession.gameState)) {
				console.log('Game over, clearing interval');
				const gameResult = this.gameService.getWinner(
					gameSession.players,
					gameSession.gameState
				);
				if (gameResult === undefined) return;
				gameSession.players[0].playerSockets.emit('gameOver', gameResult[0]);
				gameSession.players[1].playerSockets.emit('gameOver', gameResult[1]);
				//! Save match result here!
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

				// The game loop continues without waiting for the save operation to complete

				clearInterval(intervalId);
			}
			// const startUpdateTime1 = performance.now();
			this.sendGameState(roomID, gameSession.gameState);
			// const endUpdateTime1 = performance.now();

			// console.log(
			// 	`Game state send took ${endUpdateTime1 - startUpdateTime1} milliseconds`
			// );
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
		console.log('onPaddleMove event received', payload);
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
		console.log('Client playerID', client.data.playerID);
		console.log("Client's gameConfigState", payload.inputType);
		this.gameService.setCommand(
			payload,
			this.gameService.getSession(client.data.roomID),
			client.data.playerID
		);
	}

	@SubscribeMessage('startLoop')
	handleStartLoop(client: IO): void {
		if (!this.gameService.isInGame(client.data.roomID)) {
			this.beginGameLoop(client.data.roomID);
		}
		
		
	}

	@SubscribeMessage('cancelMatchmaking')
	handleCancelMatchmaking(client: IO): void {
		this.lobby = this.lobby.filter((player) => player.id !== client.id);
		console.log(
			`Client ${client.id} removed from matchmaking. New lobby size: ${this.lobby.length}`
		);
	}

	@SubscribeMessage('invitePrivate')
	handlePrivateGame(client: IO, payload: any): void {
		console.log('invitePrivate event received', payload);
		this.privateLobby.set(payload.inviteeID, client);
	}

	@SubscribeMessage('acceptPrivate')
	handleAcceptPrivate(client: IO, payload: any): void {
		console.log('acceptPrivate event received', payload);
		if (!this.privateLobby.has(payload.inviteeID))
			return console.log('No such invite');
		if (payload.accepted === false) {
			this.privateLobby.delete(payload.inviteeID);
			return;
		}
		console.log('Match found --> calling `createGame function`');
		this.createGame(client, this.privateLobby.get(payload.inviteeID));
		this.privateLobby.delete(payload.inviteeID);
	}

	@SubscribeMessage('addToLobby')
	handleAddToLobby(client: IO, payload: any): void {
		this.lobby.push(client);
		console.log(
			`Client ${client.id} added to matchmaking. New lobby size: ${this.lobby.length}`
		);
		this.checkForAvailablePlayers();
	}
}
