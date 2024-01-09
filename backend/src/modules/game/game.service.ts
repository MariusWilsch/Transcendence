import { Injectable } from '@nestjs/common';
import { GAME_CONFIG } from './helpers/game.constants';
import {
	GameSession,
	GameState,
	PaddleMove,
	Paddle,
	Ball,
	Vector,
} from './helpers/interfaces';
import { Socket } from 'socket.io';

// Helper functions
const createVec2 = (x: number, y: number) => ({ x, y });

const createSize = (width: number, height: number) => ({ width, height });

@Injectable()
export class GameService {
	private gameSessions: Map<string, GameSession> = new Map();
	private paddleSpeed: number;
	private ballSpeed: { x: number; y: number };

	private initGameState() {
		const {
			paddleWidth,
			paddleHeight,
			paddleSpeedFactor,
			ballRadius,
			ballSpeedFactor,
			canvasWidth,
			canvasHeight,
		} = GAME_CONFIG;
		this.paddleSpeed = canvasHeight * paddleSpeedFactor;
		this.ballSpeed = {
			x: canvasWidth * ballSpeedFactor,
			y: canvasHeight * ballSpeedFactor,
		};
		const paddleY = canvasHeight / 2 - paddleHeight / 2;
		return {
			paddles: {
				player1: {
					position: createVec2(0, paddleY),
					size: createSize(paddleWidth, paddleHeight),
				},
				player2: {
					position: createVec2(canvasWidth - paddleWidth, paddleY),
					size: createSize(paddleWidth, paddleHeight),
				},
			},
			ball: {
				position: createVec2(canvasWidth / 2, canvasHeight / 2),
				radius: ballRadius,
				// velocity: createVec2(
				// 	canvasWidth * ballSpeedFactor,
				// 	canvasHeight * ballSpeedFactor
				// ),
			},
			score: {
				player1: 0,
				player2: 0,
			},
		};
	}

	//* Business logic

	public createGameSession(roomID: string, player1: Socket, player2: Socket) {
		// Join both Sockets to a Socket.io room
		player1.join(roomID);
		player2.join(roomID);

		// Associate the room ID with each Socket
		player1.data = { roomID };
		player2.data = { roomID };

		// Create a new game session and store it in the Map
		this.gameSessions.set(roomID, {
			players: [player1, player2],
			gameState: this.initGameState(),
			intervalID: null,
			input: {
				player1: { up: false, down: false },
				player2: { up: false, down: false },
			},
		});
	}

	public updateGameState(roomID: string, deltaTime: number) {
		const gameSession = this.gameSessions.get(roomID);

		this.updateBall(gameSession.gameState, deltaTime);
		this.updatePaddles(gameSession, deltaTime);
		if (!this.isBallCloseToPaddle(gameSession.gameState.ball)) return;
		this.checkPaddleCollision(
			gameSession.gameState,
			this.choosePaddle(gameSession.gameState.ball)
		);
	}

	public isGameOver({ score }: GameState): boolean {
		// Implement game over condition based on game state
		if (
			score.player1 < GAME_CONFIG.WinningScore &&
			score.player2 < GAME_CONFIG.WinningScore
		)
			return false;
		return true;
	}

	//* Private

	/**
	 * The function updates the positions of the paddles based on player input and prevents them from
	 * overlapping.
	 * @param {GameSession}  - `gameState`: The current state of the game, which includes information
	 * about the paddles.
	 * @param {number} deltaTime - The `deltaTime` parameter represents the time elapsed since the last
	 * frame update. It is typically used to ensure smooth and consistent movement regardless of the frame
	 * rate. By multiplying the paddle speed with `deltaTime`, the paddle movement will be scaled based on
	 * the time passed since the last update, resulting in
	 * @returns If `didPaddleMove` is false, the function will return without performing any further
	 * actions.
	 */
	private updatePaddles({ gameState, input }: GameSession, deltaTime: number) {
		const paddles = gameState.paddles;
		let didPaddleMove = false;

		if (input.player1.up) {
			//* yCordSpeed can be taken from the game config and removed from the game state
			paddles.player1.position.y -= this.paddleSpeed * deltaTime;
			didPaddleMove = true;
		}
		if (input.player1.down) {
			paddles.player1.position.y += this.paddleSpeed * deltaTime;
			didPaddleMove = true;
		}
		if (input.player2.up) {
			paddles.player2.position.y -= this.paddleSpeed * deltaTime;
			didPaddleMove = true;
		}
		if (input.player2.down) {
			paddles.player2.position.y += this.paddleSpeed * deltaTime;
			didPaddleMove = true;
		}
		if (!didPaddleMove) return;
		this.preventPaddleOverlap(paddles.player1, paddles.player2);
	}

	/**
	 * The preventPaddleOverlap function ensures that the paddles do not overlap with the top or bottom
	 * boundaries of the game canvas.
	 * @param {Paddle} player1 - The parameter `player1` represents the first paddle in the game, while
	 * `player2` represents the second paddle.
	 * @param {Paddle} player2 - The `player2` parameter is an instance of the `Paddle` class, representing
	 * the second player's paddle in the game.
	 */
	private preventPaddleOverlap(player1: Paddle, player2: Paddle) {
		if (player1.position.y < 0) {
			player1.position.y = 0;
		} else if (
			player1.position.y >
			GAME_CONFIG.canvasHeight - player1.size.height
		) {
			player1.position.y = GAME_CONFIG.canvasHeight - player1.size.height;
		}

		if (player2.position.y < 0) {
			player2.position.y = 0;
		} else if (
			player2.position.y >
			GAME_CONFIG.canvasHeight - player2.size.height
		) {
			player2.position.y = GAME_CONFIG.canvasHeight - player2.size.height;
		}
	}

	/**
	 * The function checks for a collision between a ball and a paddle in a game and changes the ball's
	 * horizontal velocity if a collision is detected.
	 * @param {GameState} gameState - The `gameState` parameter is an object that represents the current
	 * state of the game. It contains information about the ball and the paddles.
	 * @param {string} [playerID] - The `playerID` parameter is an optional parameter that represents the
	 * ID of the player whose paddle collision is being checked. It is used to access the specific paddle
	 * from the `gameState.paddles` object. If `playerID` is not provided, the function will not be able to
	 * check
	 */
	private checkPaddleCollision(gameState: GameState, playerID: string) {
		const ball = gameState.ball;
		const paddle = gameState.paddles[playerID];

		// Calculate the ball's edges
		const ballLeft = ball.position.x - ball.radius;
		const ballRight = ball.position.x + ball.radius;
		const ballTop = ball.position.y - ball.radius;
		const ballBottom = ball.position.y + ball.radius;

		// Calculate the paddle's edges
		const paddleLeft = paddle.position.x;
		const paddleRight = paddle.position.x + paddle.size.width;
		const paddleTop = paddle.position.y;
		const paddleBottom = paddle.position.y + paddle.size.height;

		// Check for a collision
		if (
			ballRight > paddleLeft &&
			ballLeft < paddleRight &&
			ballBottom > paddleTop &&
			ballTop < paddleBottom
		) {
			// Collision detected
			// Reverse the ball's x velocity
			this.ballSpeed.x *= -1;
			// ball.velocity.x *= -1;
		}
	}

	private updateBall({ ball, score }: GameState, deltaTime: number): void {
		const { canvasHeight, canvasWidth } = GAME_CONFIG;
		ball.position.x += this.ballSpeed.x * deltaTime;
		ball.position.y += this.ballSpeed.y * deltaTime;

		// If ball is not close to the edge, return
		// if (ball.position.y > 100 && ball.position.y < canvas.height - 100) {
		// 	return;
		// } //! Is this working?

		// If ball hits the top or bottom wall, reverse the y velocity
		if (ball.position.y - ball.radius <= 0) {
			this.ballSpeed.y *= -1;
			ball.position.y = ball.radius;
		} else if (ball.position.y + ball.radius >= canvasHeight) {
			this.ballSpeed.y *= -1;
			ball.position.y = canvasHeight - ball.radius;
		}

		// If ball hits the left
		if (ball.position.x - ball.radius <= 0) {
			score.player1++;
			this.resetBall(ball);
			return;
		}
		// If ball hits the right wall
		if (ball.position.x + ball.radius >= canvasWidth) {
			score.player2++;
			this.resetBall(ball);
			return;
		}

		// console.log(
		// 	`[After Update] Ball Position: x=${ball.position.x}, y=${ball.position.y}`
		// );
	}

	public deleteGameSession(clientID: string, roomID: string): void {
		const gameSession = this.gameSessions.get(roomID);

		if (gameSession) {
			// Remove the game session
			this.gameSessions.delete(roomID);
			// Disconnect the other player
			const otherPlayer = gameSession.players.find(
				(player) => player.id !== clientID
			);
			if (otherPlayer) {
				otherPlayer.disconnect();
			}
			// this.clearGameSession(gameSession);
		}
	}

	public isInGame(roomID: string): boolean {
		console.log('Does the room exist?', this.gameSessions.has(roomID));
		return this.gameSessions.has(roomID);
	}

	//* Getters

	public getGameState(roomID: string): GameState {
		if (this.gameSessions.size == 0) return null;
		return this.gameSessions.get(roomID).gameState;
	}

	public getIntervalID(roomID: string): NodeJS.Timeout {
		if (this.gameSessions.size == 0) return null;
		return this.gameSessions.get(roomID).intervalID;
	}

	public getSession(roomID: string): GameSession {
		return this.gameSessions.get(roomID);
	}

	//* Setters

	public setIntervalID(roomID: string, intervalID: NodeJS.Timeout) {
		this.gameSessions.get(roomID).intervalID = intervalID;
	}

	public setInputBool(roomID: string, payload: PaddleMove) {
		//1. Get the input object
		const input = this.gameSessions.get(roomID).input[payload.player];

		// 2. Decide which input to set
		switch (payload.direction) {
			case 'up':
				input.up = true;
				break;
			case 'down':
				input.down = true;
				break;
			case 'stop':
				input.up = false;
				input.down = false;
				break;
		}
	}

	//* Helpers

	// private clearGameSession(gameSession: GameSession) {
	// 	gameSession.players = [];
	// 	gameSession.gameState = null;
	// 	gameSession.intervalID = null;
	// 	gameSession.input = null;
	// }

	private getPaddleCenter(paddle: Paddle): Vector {
		return createVec2(
			paddle.position.x + paddle.size.width / 2,
			paddle.position.y + paddle.size.height / 2
		);
	}

	private choosePaddle(ball: Ball): string {
		return ball.position.x < GAME_CONFIG.canvasWidth / 2
			? 'player1'
			: 'player2';
	}

	/**
	 * The function checks if the ball is close to the paddle based on its position and proximity
	 * threshold.
	 * @param {Ball}  - `position`: The current position of the ball, which includes `x` and `y`
	 * coordinates.
	 * @returns a boolean value. If the ball's x position is less than the canvas width minus the proximity
	 * threshold or greater than the proximity threshold, it will return true. Otherwise, it will return
	 * false.
	 */
	private isBallCloseToPaddle({ position }: Ball): boolean {
		const { canvasWidth, proximityThreshold } = GAME_CONFIG;
		// Return early if the ball is not close to the paddle
		if (position.x < canvasWidth - proximityThreshold) return true;
		if (position.x > proximityThreshold) return true;
		return false;
	}

	private resetBall(ball: Ball) {
		ball.position.x = GAME_CONFIG.canvasWidth / 2;
		ball.position.y = GAME_CONFIG.canvasHeight / 2;
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
