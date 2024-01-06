import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket as IO } from 'socket.io';
import { GameState } from './interfaces';
import { GameService } from './game.service';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
	},
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private gameCreated = false;

	constructor(private gameService: GameService) {}

	@WebSocketServer() Server: Server;
	lobby: IO[] = [];

	//! I'm stuck here, continue developing from here
	@SubscribeMessage('onPaddleMove')
	handlePaddleMove(client: IO, payload: any): void {
		// payload could include details like the player ID and the new paddle position
		// Update the game state based on this information
		console.log('Paddle moved', payload);
		// Further processing...
	}

	handleConnection(client: IO) {
		console.log(`Client connected via ${client.id}`);

		this.lobby.push(client);
		console.log('lobby size', this.lobby.length);

		this.checkForAvailablePlayers();
	}

	handleDisconnect(client: IO) {
		this.lobby = this.lobby.filter((player) => player.id !== client.id);
		console.log(`Client disconnected via ${client.id}`);
	}

	checkForAvailablePlayers() {
		if (this.lobby.length < 2) return;
		const player1 = this.lobby.shift();
		const player2 = this.lobby.shift();
		console.log('Match found --> calling `startGame func`');
		this.createGame(player1, player2);
	}

	sendGameState(gameState: GameState) {
		//! Optimization ideas
		// Only send dimensions once (on game start)
		// Only send score when it changes
		// Don't send ball & paddle velocities
		// console.log('Sending game state');

		if (this.gameCreated) {
			// console.log('Sending game state');
			this.Server.emit('gameState', gameState);
		} else {
			console.log('Creating game');

			this.Server.emit('createGame', gameState);
			this.gameCreated = true;
		}
	}

	beginGameLoop(game: GameService) {
		let lastTime = performance.now();
		let counter = 0;

		if (counter++ == 0) console.log('Game loop started');
		const intervalId = setInterval(() => {
			const currentTime = performance.now();
			const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
			lastTime = currentTime;

			game.updateGameState(deltaTime);
			// If game is over, clear the interval
			if (this.isGameOver()) {
				clearInterval(intervalId);
			}
			this.sendGameState(game.getGameState());
		}, 1000 / 60); // Run the loop at approximately 60 FPS
	}

	isGameOver(): boolean {
		// Implement game over condition
		// console.log('Lobby size:', this.lobby.length);

		if (this.lobby.length != 0) {
			this.gameCreated = false;
			return true; // Return true if there are less than 2 players in the lobby
		}
		return false;
	}

	createGame(player1: IO, player2: IO) {
		console.log('Starting game between', player1.id, 'and', player2.id);
		this.gameCreated = false;
		this.gameService.
		// const game = new GameService(
		// 	gameConfig.canvasWidth,
		// 	gameConfig.canvasHeight
		// );
		// this.sendGameState(game.getGameState());

		//* start game loop
		// this.beginGameLoop(game);
	}
}
