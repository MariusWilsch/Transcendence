import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket as IO } from 'socket.io';
import { GameState, GameSession, PaddleMove } from './helpers/interfaces';
import { GameService } from './game.service';
import { v4 as uuidv4 } from 'uuid';
import { GAME_CONFIG } from './helpers/game.constants';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
	},
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private gameService: GameService) {}

	@WebSocketServer() Server: Server;
	lobby: IO[] = [];

	handleConnection(client: IO) {
		console.log(`Client connected via ${client.id}`);

		this.lobby.push(client);
		console.log('lobby size', this.lobby.length);

		this.checkForAvailablePlayers();
	}

	handleDisconnect(client: IO) {
		this.lobby = this.lobby.filter((player) => player.id !== client.id);
		console.log(`Client disconnected via ${client.id}`);
		// If the client was in a running game clear the interval
		const roomID = client.data.roomID;
		if (this.gameService.isInGame(roomID)) {
			console.log('Client was in a running game, clearing interval');
			clearInterval(this.gameService.getIntervalID(roomID));
			this.gameService.deleteGameSession(client.id, roomID);
		}
	}

	checkForAvailablePlayers() {
		if (this.lobby.length < 2) return;
		const player1 = this.lobby.shift();
		const player2 = this.lobby.shift();
		console.log('Match found --> calling `createGame function`');
		this.createGame(player1, player2);
	}

	createGame(player1: IO, player2: IO) {
		// Generate a room ID
		const roomID = uuidv4();

		// Create a new game session and store it in the Map
		this.gameService.createGameSession(roomID, player1, player2);

		//? Emit an event to both Sockets in the room
		const gameState = this.gameService.getGameState(roomID);
		this.Server.to(roomID).emit('createGame', {
			...gameState,
			canvasWidth: GAME_CONFIG.canvasWidth,
			canvasHeight: GAME_CONFIG.canvasHeight,
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
				const gameResult = this.gameService.getWinner(gameSession.gameState);
				console.log('Game result', gameResult);
				gameSession.players[0].emit('gameOver', gameResult[0]);
				gameSession.players[1].emit('gameOver', gameResult[1]);
				clearInterval(intervalId);
			}
			// const startUpdateTime1 = performance.now();
			this.sendGameState(roomID, gameSession.gameState);
			// const endUpdateTime1 = performance.now();

			// console.log(
			// 	`Game state send took ${endUpdateTime1 - startUpdateTime1} milliseconds`
			// );
		}, 1000 / 60); // Run the loop at approximately 60 FPS

		this.gameService.setIntervalID(roomID, intervalId);
	}

	//! Optimization ideas
	// Only send dimensions once (on game start)
	// Only send score when it changes
	// Don't send ball & paddle velocities

	sendGameState(roomID: string, gameState: GameState) {
		this.Server.to(roomID).emit('gameState', gameState);
	}

	@SubscribeMessage('onPaddleMove')
	handlePaddleMove(client: IO, payload: PaddleMove): void {
		const roomID = client.data.roomID;
		const gameSession: GameSession = this.gameService.getSession(
			client.data.roomID
		);

		if (
			(payload.player === 'player1' &&
				client.id !== gameSession.players[0].id) ||
			(payload.player === 'player2' && client.id !== gameSession.players[1].id)
		) {
			return;
		}

		// Notify game service of the paddle move
		console.log('onPaddleMove event received', payload);
		this.gameService.setInputBool(roomID, payload);
	}

	@SubscribeMessage('startLoop')
	handleStartLoop(client: IO): void {
		console.log('startLoop event received');
		if (!this.gameService.isInGame(client.data.roomID))
			this.beginGameLoop(client.data.roomID);
	}
}
