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
		console.log('client rooms', client.data.roomID);
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
		this.Server.to(roomID).emit(
			'createGame',
			this.gameService.getGameState(roomID)
		);

		// Start the game loop
		this.beginGameLoop(roomID);
	}

	beginGameLoop(roomID: string) {
		let lastTime = performance.now();
		let counter = 0;

		if (counter++ == 0) console.log('Game loop started');
		const intervalId = setInterval(() => {
			const currentTime = performance.now();
			const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
			lastTime = currentTime;

			this.gameService.updateGameState(roomID, deltaTime);
			// If game is over, clear the interval
			if (this.isGameOver(roomID)) {
				clearInterval(intervalId);
			}
			this.sendGameState(roomID, this.gameService.getGameState(roomID));
		}, 1000 / 60); // Run the loop at approximately 60 FPS
	}

	isGameOver(roomID: string): boolean {
		//* Implement game over condition
		if (this.lobby.length != 0) {
			return true; // Return true if there are no players in the lobby
		} //! Only works for 2 players for now

		// Consult GameService for game-related conditions
		return this.gameService.isGameOver(roomID);
	}

	sendGameState(roomID: string, gameState: GameState) {
		//! Optimization ideas
		// Only send dimensions once (on game start)
		// Only send score when it changes
		// Don't send ball & paddle velocities
		// console.log('Sending game state');

		this.Server.to(roomID).emit('gameState', gameState);
	}

	@SubscribeMessage('onPaddleMove')
	handlePaddleMove(client: IO, payload: any): void {
		console.log('ROOM ID', client.data.roomID, 'by', client.id);

		// payload could include details like the player ID and the new paddle position
		// Update the game state based on this information
		this.gameService.updatePaddleState(
			client,
			client.data.roomID,
			payload.direction
		);
		// Further processing...
	}
	@SubscribeMessage('onScoreChange')
	handleScoreChange(client: IO, payload: any): void {
		console.log('ROOM ID', client.data.roomID, 'by', client.id);

		// payload could include details like the player ID and the new paddle position
		// Update the game state based on this information
		// this.gameService.updateScore(client.data.roomID, payload);
		// Further processing...
	}
}

// sendGameState(gameState: GameState) {
// 	//! Optimization ideas
// 	// Only send dimensions once (on game start)
// 	// Only send score when it changes
// 	// Don't send ball & paddle velocities
// 	// console.log('Sending game state');

// 	if (this.gameCreated) {
// 		// console.log('Sending game state');
// 		this.Server.emit('gameState', gameState);
// 	} else {
// 		console.log('Creating game');

// 		this.Server.emit('createGame', gameState);
// 		this.gameCreated = true;
// 	}
// }

// beginGameLoop() {
// 	let lastTime = performance.now();
// 	let counter = 0;

// 	if (counter++ == 0) console.log('Game loop started');
// 	const intervalId = setInterval(() => {
// 		const currentTime = performance.now();
// 		const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
// 		lastTime = currentTime;

// 		this.gameService.updateGameState(deltaTime);
// 		// If game is over, clear the interval
// 		if (this.isGameOver()) {
// 			clearInterval(intervalId);
// 		}
// 		this.sendGameState(this.gameService.getGameState());
// 	}, 1000 / 60); // Run the loop at approximately 60 FPS
// }

// isGameOver(): boolean {
// 	//* Implement game over condition

// 	if (this.lobby.length != 0) {
// 		this.gameCreated = false;
// 		return true; // Return true if there are no players in the lobby
// 	} //! Only works for 2 players for now

// 	// Consult GameService for game-related conditions
// 	return this.gameService.isGameOver();
// }

// @SubscribeMessage('onPaddleMove')
// handlePaddleMove(client: IO, payload: PaddleMove): void {
// 	console.log('Paddle moved', payload.direction, 'by', client.id);
// 	// payload could include details like the player ID and the new paddle position
// 	// Update the game state based on this information
// 	// Further processing...
// }
// }
// @WebSocketGateway({
// 	cors: {
// 		origin: 'http://localhost:3000',
// 	},
// })
// export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
// 	private gameCreated = false;

// 	constructor(private gameService: GameService) {}

// 	@WebSocketServer() Server: Server;
// 	lobby: IO[] = [];

// 	//! I'm stuck here, continue developing from here
// 	@SubscribeMessage('onPaddleMove')
// 	handlePaddleMove(client: IO, payload: PaddleMove): void {
// 		console.log('Paddle moved', payload.direction, 'by', client.id);
// 		// payload could include details like the player ID and the new paddle position
// 		// Update the game state based on this information
// 		// Further processing...
// 	}

// 	handleConnection(client: IO) {
// 		console.log(`Client connected via ${client.id}`);

// 		this.lobby.push(client);
// 		console.log('lobby size', this.lobby.length);

// 		this.checkForAvailablePlayers();
// 	}

// 	handleDisconnect(client: IO) {
// 		this.lobby = this.lobby.filter((player) => player.id !== client.id);
// 		console.log(`Client disconnected via ${client.id}`);
// 	}

// 	checkForAvailablePlayers() {
// 		if (this.lobby.length < 2) return;
// 		const player1 = this.lobby.shift();
// 		const player2 = this.lobby.shift();
// 		console.log('Match found --> calling `startGame func`');
// 		this.createGame(player1, player2);
// 	}

// 	//! Old Create Game
// 	// createGame(player1: IO, player2: IO) {
// 	// 	console.log('Starting game between', player1.id, 'and', player2.id);
// 	// 	this.gameCreated = false;
// 	// 	this.gameService.initGameState(player1.id, player2.id);

// 	// 	//* send initial game state
// 	// 	this.sendGameState(this.gameService.getGameState());

// 	// 	//* start game loop
// 	// 	// this.beginGameLoop();
// 	// }

// 	sendGameState(gameState: GameState) {
// 		//! Optimization ideas
// 		// Only send dimensions once (on game start)
// 		// Only send score when it changes
// 		// Don't send ball & paddle velocities
// 		// console.log('Sending game state');

// 		if (this.gameCreated) {
// 			// console.log('Sending game state');
// 			this.Server.emit('gameState', gameState);
// 		} else {
// 			console.log('Creating game');

// 			this.Server.emit('createGame', gameState);
// 			this.gameCreated = true;
// 		}
// 	}

// 	beginGameLoop() {
// 		let lastTime = performance.now();
// 		let counter = 0;

// 		if (counter++ == 0) console.log('Game loop started');
// 		const intervalId = setInterval(() => {
// 			const currentTime = performance.now();
// 			const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
// 			lastTime = currentTime;

// 			this.gameService.updateGameState(deltaTime);
// 			// If game is over, clear the interval
// 			if (this.isGameOver()) {
// 				clearInterval(intervalId);
// 			}
// 			this.sendGameState(this.gameService.getGameState());
// 		}, 1000 / 60); // Run the loop at approximately 60 FPS
// 	}

// 	isGameOver(): boolean {
// 		//* Implement game over condition

// 		if (this.lobby.length != 0) {
// 			this.gameCreated = false;
// 			return true; // Return true if there are no players in the lobby
// 		} //! Only works for 2 players for now

// 		// Consult GameService for game-related conditions
// 		return this.gameService.isGameOver();
// 	}
// }
