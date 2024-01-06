/* eslint-disable @typescript-eslint/lines-between-class-members */
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket as IO } from 'socket.io';

const gameConfig = {
	//* Canvas
	canvasWidth: 600,
	canvasHeight: 400,
	//* Paddle
	paddleWidth: 20,
	paddleHeight: 100,
	paddleSpeedY: 5,
	//* Ball
	ballRadius: 20,
	ballSpeedFactor: 0.75,
	//* Loop variables
	fps: 60,
};

interface Vector {
	x: number;
	y: number;
}

interface Size {
	width: number;
	height: number;
}

class Paddle {
	position: Vector;
	size: Size;
	yCordSpeed: number;
}

class Ball {
	position: Vector;
	radius: number;
	velocity: Vector;
}

const createVec2 = (x: number, y: number) => ({ x, y });

const createSize = (width: number, height: number) => ({ width, height });

class GameState {
	paddles: { player1: Paddle; player2: Paddle };
	ball: Ball;
	score: { player1: number; player2: number };
	canvas: { width: number; height: number };
}

interface PaddleMove {
	playerID: number;
	direction: 'up' | 'down';
}

class GameService {
	private gameState: GameState;

	constructor(canvasWidth: number, canvasHeight: number) {
		const { paddleWidth, paddleHeight, paddleSpeedY, ballRadius } = gameConfig;
		const paddleY = canvasHeight / 2 - paddleHeight / 2;
		this.gameState = {
			paddles: {
				player1: {
					position: createVec2(0, paddleY),
					size: createSize(paddleWidth, paddleHeight),
					yCordSpeed: paddleSpeedY,
				},
				player2: {
					position: createVec2(canvasWidth - paddleWidth, paddleY),
					size: createSize(paddleWidth, paddleHeight),
					yCordSpeed: paddleSpeedY,
				},
			},
			ball: {
				position: createVec2(canvasWidth / 2, canvasHeight / 2),
				radius: ballRadius,
				velocity: createVec2(0, canvasHeight * gameConfig.ballSpeedFactor),
			},
			score: {
				player1: 0,
				player2: 0,
			},
			canvas: {
				width: canvasWidth,
				height: canvasHeight,
			},
		};
	}
	public getGameState() {
		return this.gameState;
	}

	public updateGameState(deltaTime: number) {
		this.updateBall(deltaTime);
		// this.updatePaddles(deltaTime);
	}

	//* Private

	private updateBall(deltaTime: number) {
		const { ball, canvas } = this.gameState;
		// console.log(ball.position.x, ball.position.y);
		ball.position.x += ball.velocity.x * deltaTime;
		ball.position.y += ball.velocity.y * deltaTime;

		// Check for collisions with top and bottom walls
		if (
			ball.position.y + ball.radius >= canvas.height ||
			ball.position.y - ball.radius <= 0
		) {
			ball.velocity.y *= -1;
		}
	}

	private updatePaddles(deltaTime: number) {}
}

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
	},
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private gameCreated = false;

	@WebSocketServer() Server: Server;
	lobby: IO[] = [];

	@SubscribeMessage('onPaddleMove')
	//! I'm stuck here, continue developing from here
	handlePaddleMove(client: IO, payload: PaddleMove): void {
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
		// let frameCount = 0;

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

			// frameCount++;
		}, 1000 / 60); // Run the loop at approximately 60 FPS

		// setInterval(() => {
		// 	console.log('FPS:', frameCount);
		// 	frameCount = 0;
		// }, 1000); // Print FPS every second
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
		const game = new GameService(
			gameConfig.canvasWidth,
			gameConfig.canvasHeight
		);
		this.sendGameState(game.getGameState());

		//* start game loop
		// this.beginGameLoop(game);
	}
}
