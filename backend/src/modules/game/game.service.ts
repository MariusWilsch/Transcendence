import { Injectable } from '@nestjs/common';
import { GAME_CONFIG } from './helpers/game.constants';
import { PlayerSession } from './helpers/interfaces';
import { Socket } from 'socket.io';

// Helper functions
const createVec2 = (x: number, y: number) => ({ x, y });

const createSize = (width: number, height: number) => ({ width, height });

@Injectable()
export class GameService {
	private gameSessions: Map<string, PlayerSession> = new Map();

	// private GameSessions: Map<//RoomID (string), GameState (object)> = new Map();

	private initGameState() {
		const {
			paddleWidth,
			paddleHeight,
			paddleSpeedY,
			ballRadius,
			ballSpeedFactor,
			canvasWidth,
			canvasHeight,
		} = GAME_CONFIG;
		const paddleY = canvasHeight / 2 - paddleHeight / 2;
		return {
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
				velocity: createVec2(0, canvasHeight * ballSpeedFactor),
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

	//* Business logic

	public createGameSession(roomID: string, playersID: string[]) {
		const newPlayerSession: PlayerSession = {
			playersID,
			gameState: this.initGameState(),
		};
		this.gameSessions.set(roomID, newPlayerSession);
		console.log('Player IDS', this.gameSessions.get(roomID).playersID);
	}

	public updateGameState(roomID: string, deltaTime: number) {
		this.updateBall(roomID, deltaTime);
		this.updatePaddles(roomID, deltaTime);
	}

	public isGameOver(roomID: string): boolean {
		// Implement game over condition based on game state
		// Example: return true if score limit is reached

		return false;
	}

	public updatePaddleState(client: Socket, roomID: string, direction: string) {
		console.log('Paddle move event received');
		// 1. Get the game state
		const gameState = this.getGameState(roomID);
		// Update the paddle position based on the direction
		// Update the game state
		// Further processing...
	}

	//* Getters

	public getGameState(roomID: string) {
		return this.gameSessions.get(roomID).gameState;
	}

	public getMapSize = () => this.gameSessions.size;

	//* Private

	private updateBall(roomID: string, deltaTime: number) {
		const { ball, canvas } = this.gameSessions.get(roomID).gameState;
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
	} //! Improve collision detection

	private updatePaddles(roomID: string, deltaTime: number) {
		const { paddles, canvas } = this.gameSessions.get(roomID).gameState;
		// paddles.player1.position.y *= deltaTime;
		// paddles.player2.position.y *= deltaTime;
	}
}

// @Injectable()
// export class GameService {
// 	private gameState: GameState;

// 	public initGameState(playerSocketID1: string, playerSocketID2: string) {
// 		const {
// 			paddleWidth,
// 			paddleHeight,
// 			paddleSpeedY,
// 			ballRadius,
// 			ballSpeedFactor,
// 			canvasWidth,
// 			canvasHeight,
// 		} = GAME_CONFIG;
// 		const paddleY = canvasHeight / 2 - paddleHeight / 2;
// 		this.gameState = {
// 			paddles: {
// 				player1: {
// 					position: createVec2(0, paddleY),
// 					size: createSize(paddleWidth, paddleHeight),
// 					yCordSpeed: paddleSpeedY,
// 					socketID: playerSocketID1,
// 				},
// 				player2: {
// 					position: createVec2(canvasWidth - paddleWidth, paddleY),
// 					size: createSize(paddleWidth, paddleHeight),
// 					yCordSpeed: paddleSpeedY,
// 					socketID: playerSocketID2,
// 				},
// 			},
// 			ball: {
// 				position: createVec2(canvasWidth / 2, canvasHeight / 2),
// 				radius: ballRadius,
// 				velocity: createVec2(0, canvasHeight * ballSpeedFactor),
// 			},
// 			score: {
// 				player1: 0,
// 				player2: 0,
// 			},
// 			canvas: {
// 				width: canvasWidth,
// 				height: canvasHeight,
// 			},
// 		};
// 	}

// 	public getGameState() {
// 		return this.gameState;
// 	}

// 	public updateGameState(deltaTime: number) {
// 		this.updateBall(deltaTime);
// 		// this.updatePaddles(deltaTime);
// 	}

// 	public isGameOver(): boolean {
// 		// Implement game over condition based on game state
// 		// Example: return true if score limit is reached

// 		return false;
// 	}

// 	//* Private

// 	private updateBall(deltaTime: number) {
// 		const { ball, canvas } = this.gameState;
// 		// console.log(ball.position.x, ball.position.y);
// 		ball.position.x += ball.velocity.x * deltaTime;
// 		ball.position.y += ball.velocity.y * deltaTime;

// 		// Check for collisions with top and bottom walls
// 		if (
// 			ball.position.y + ball.radius >= canvas.height ||
// 			ball.position.y - ball.radius <= 0
// 		) {
// 			ball.velocity.y *= -1;
// 		}
// 	} //! Improve collision detection

// 	private updatePaddles(deltaTime: number) {}
// }
