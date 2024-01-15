import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket as IO } from 'socket.io';
import { GameState } from './helpers/interfaces';
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
		this.Server.to(roomID).emit('createGame', {
			gameState: this.gameService.getGameState(roomID),
			canvasWidth: GAME_CONFIG.canvasWidth,
			canvasHeight: GAME_CONFIG.canvasHeight,
		});

		// Start the game loop
		this.beginGameLoop(roomID);
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

			// if (deltaTime > 0.02) {
			// 	console.log(`High Delta Time Detected: ${deltaTime}`);
			// }

			// const startUpdateTime = performance.now();
			this.gameService.updateGameState(roomID, deltaTime);
			// const endUpdateTime = performance.now();

			// console.log(
			// 	`Game state update took ${endUpdateTime - startUpdateTime} milliseconds`
			// );

			if (this.gameService.isGameOver(this.gameService.getGameState(roomID))) {
				console.log('Game over, clearing interval');
				clearInterval(intervalId);
			}
			// const startUpdateTime1 = performance.now();
			this.sendGameState(roomID, this.gameService.getGameState(roomID));
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
	// console.log('Sending game state');
	// console.log('Server-side:');
	sendGameState(roomID: string, gameState: GameState) {
		// console.log
		this.Server.to(roomID).emit('gameState', gameState);
	}

	@SubscribeMessage('onPaddleMove')
	handlePaddleMove(client: IO, payload: any): void {
		// Notify game service of the paddle move
		this.gameService.setInputBool(client.data.roomID, payload);
	}
}
