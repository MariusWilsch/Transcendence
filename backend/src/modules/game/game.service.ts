import { Injectable } from '@nestjs/common';
import { GAME_CONFIG } from './helpers/game.constants';
import {
	GameSession,
	GameState,
	PaddleMove,
	Paddle,
	Ball,
	Vector,
	Size,
} from './helpers/interfaces';
import { Socket } from 'socket.io';

// Helper functions
const createVec2 = (x: number, y: number): Vector => ({ x, y });

const createSize = (width: number, height: number): Size => ({ width, height });

@Injectable()
export class GameService {
	private gameSessions: Map<string, GameSession> = new Map();
	//! The two variables only work if they stay the same across all game sessions
	private paddleSpeed: number;
	private collisionOccurred = false;
	private justScored = false;

	//* Business logic

	/**
	 * The createGameSession function creates a new game session by joining two players to a room,
	 * associating the room ID with each player, and storing the game session in a Map.
	 * @param {string} roomID - The roomID is a string that represents the unique identifier for the game
	 * session. It is used to associate the players and their game state with a specific room.
	 * @param {Socket} player1 - The `player1` parameter is a Socket object representing the first player
	 * in the game session. It is used to join the player to a Socket.io room and associate the room ID
	 * with the player's data.
	 * @param {Socket} player2 - The `player2` parameter is a Socket object representing the second player
	 * in the game session. A Socket object is typically used in Socket.io to represent a client connection
	 * to the server. In this case, it is used to represent the second player's connection to the game
	 * server.
	 */
	public createGameSession(roomID: string, player1: Socket, player2: Socket) {
		// Join both Sockets to a Socket.io room
		player1.join(roomID);
		player2.join(roomID);

		// Associate the room ID with each Socket
		player1.data = { roomID };
		player2.data = { roomID };

		// Create a new game session and store it in the Map
		this.gameSessions.set(roomID, {
			ballVelocity: createVec2(
				GAME_CONFIG.canvasWidth * GAME_CONFIG.ballSpeedFactor,
				0
				// GAME_CONFIG.canvasHeight * GAME_CONFIG.ballSpeedFactor
			),
			players: [player1, player2],
			gameState: this.initGameState(),
			intervalID: null,
			input: {
				player1: { up: false, down: false },
				player2: { up: false, down: false },
			},
		});
	}

	/**
	 * The function updates the game state by updating the ball's position, updating the paddles'
	 * positions, and checking for collisions between the ball and the paddles.
	 * @param {string} roomID - The `roomID` parameter is a string that represents the unique identifier of
	 * the game room. It is used to retrieve the corresponding game session from the `gameSessions` map.
	 * @param {number} deltaTime - The `deltaTime` parameter represents the time elapsed since the last
	 * update of the game state. It is typically measured in milliseconds or seconds and is used to
	 * calculate the changes in the game state based on the passage of time.
	 * @returns There is no return statement in the provided code snippet. Therefore, nothing is being
	 * returned.
	 */
	public updateGameState(gameSession: GameSession, deltaTime: number) {
		this.updateBall(gameSession.gameState, gameSession.ballVelocity, deltaTime);
		this.updatePaddles(gameSession, deltaTime);
		if (!this.isBallCloseToPaddle(gameSession.gameState.ball)) return;
		this.checkPaddleCollision(
			gameSession,
			this.choosePaddle(gameSession.gameState.ball)
		);
	}

	/**
	 * The function checks if the game is over based on the score of the players.
	 * @param {GameState}  - The `isGameOver` function takes in a `GameState` object as a parameter. The
	 * `GameState` object has a property called `score`, which is an object containing the scores of two
	 * players (`player1` and `player2`).
	 * @returns a boolean value. If the game is over, it will return true. Otherwise, it will return false.
	 */
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

	private initGameState() {
		const {
			paddleWidth,
			paddleHeight,
			paddleSpeedFactor,
			ballRadius,
			canvasWidth,
			canvasHeight,
		} = GAME_CONFIG;
		this.paddleSpeed = canvasHeight * paddleSpeedFactor;
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
			},
			score: {
				player1: 0,
				player2: 0,
			},
		};
	}

	/**
	 * The function updates the positions of the paddles based on player input and prevents them from
	 * overlapping.
	 * @param {GameSession}  - `gameState`: The current state of the game, which includes information
	 * about the paddles.
	 * @param {number} deltaTime - The `deltaTime` parameter represents the time elapsed since the last
	 * frame update. It is typically used to ensure smooth and consistent movement regardless of the frame
	 * rate. By multiplying the paddle speed with `deltaTime`, the paddle movement will be scaled based on
	 * the time passed since the last update, resulting in
	 * @description If `didPaddleMove` is false, the function will return without performing any further
	 * actions.
	 */
	private updatePaddles({ gameState, input }: GameSession, deltaTime: number) {
		const paddles = gameState.paddles;
		let didPaddleMove = false;

		if (input.player1.up) {
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
	 * The function checks if the ball collides with the top or bottom wall and updates its velocity and
	 * position accordingly.
	 * @param {Ball}  - - `position`: The current position of the ball, represented as an object with `x`
	 * and `y` coordinates.
	 */
	private checkTopBottomWallCollision(
		{ position, radius }: Ball,
		ballVelocity: Vector
	) {
		if (position.y - radius <= 0) {
			ballVelocity.y *= -1;
			position.y = radius;
		} else if (position.y + radius >= GAME_CONFIG.canvasHeight) {
			ballVelocity.y *= -1;
			position.y = GAME_CONFIG.canvasHeight - radius;
		}
	}

	/**
	 * The function checks for a collision between a ball and a paddle in a game and changes the ball's
	 * horizontal velocity if a collision is detected.
	 * @param {GameState} gameState - The `gameState` parameter is an object that represents the current
	 * state of the game. It contains information about the ball and the paddles.
	 * @param {string} [playerID] - The `playerID` parameter is an parameter that represents the
	 * ID of the player whose paddle collision is being checked. It is used to access the specific paddle
	 * from the `gameState.paddles` object. If `playerID` is not provided, the function will not be able to
	 * check
	 */ //! The ball still sticks to the paddle sometimes
	private checkPaddleCollision(
		{ gameState, ballVelocity }: GameSession,
		playerID: string
	) {
		if (this.collisionOccurred) {
			// Skip collision detection in this frame
			this.collisionOccurred = false;
			if (this.justScored) {
				this.justScored = false;
				ballVelocity.x = GAME_CONFIG.canvasWidth * GAME_CONFIG.ballSpeedFactor;
				return;
			}
			return;
		}

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
			const paddleCenterY = paddle.position.y + paddle.size.height / 2;
			const collisionPoint =
				(ball.position.y - paddleCenterY) / (paddle.size.height / 2);
			const angle = collisionPoint * (Math.PI / 6);
			const magnitude = Math.sqrt(
				ballVelocity.x * ballVelocity.x + ballVelocity.y * ballVelocity.y
			);
			// Adjust the ball's Y-velocity based on the bounce angle
			if (playerID === 'player1') {
				ballVelocity.x = magnitude * Math.cos(angle);
			} else {
				ballVelocity.x = -magnitude * Math.cos(angle);
			}
			ballVelocity.y = magnitude * Math.sin(angle);
			// Collision detected // Reverse the ball's x velocity
			// Set the collisionOccurred flag to true
			this.collisionOccurred = true;
		}
	}

	private updateBall(
		{ ball, score }: GameState,
		ballVelocity: Vector,
		deltaTime: number
	): void {
		// console.log('Ball state before sending', ball);
		// console.log("Ball's velocity before sending", ballVelocity);

		ball.position.x += ballVelocity.x * deltaTime;

		ball.position.y += ballVelocity.y * deltaTime;

		// If ball hits the top or bottom wall, reverse the y velocity
		this.checkTopBottomWallCollision(ball, ballVelocity);

		// If ball hits the left
		if (ball.position.x - ball.radius <= 0) {
			this.justScored = true;
			score.player1++;
			this.resetBall(ball, ballVelocity);
			return;
		}
		// If ball hits the right wall
		if (ball.position.x + ball.radius >= GAME_CONFIG.canvasWidth) {
			this.justScored = true;
			score.player2++;
			this.resetBall(ball, ballVelocity);
			return;
		}
	}

	//! This function is still subject to change
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
		}
	}

	/**
	 * The function checks if a game room exists based on the provided room ID.
	 * @param {string} roomID - A string representing the ID of a game room.
	 * @returns a boolean value.
	 */
	public isInGame(roomID: string): boolean {
		if (this.gameSessions.size == 0) return false;
		return this.gameSessions.get(roomID).intervalID !== null;
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

	public getWinner({ score }: GameState): boolean[] {
		if (score.player1 === GAME_CONFIG.WinningScore) {
			return [true, false];
		} else {
			return [false, true];
		}
	}
	//* Helpers

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
		if (
			position.x < canvasWidth - proximityThreshold &&
			position.x > proximityThreshold
		)
			return false;
		return true;
	}

	/**
	 * The function "resetBall" resets the position of a ball to the center of the canvas.
	 * @param {Ball} ball - The parameter "ball" is of type "Ball". It represents an instance of the Ball
	 * class, which has properties such as position and size.
	 */
	private resetBall(ball: Ball, ballVelocity: Vector) {
		ball.position.x = GAME_CONFIG.canvasWidth / 2;
		ball.position.y = GAME_CONFIG.canvasHeight / 2;

		// Reverse the ball's x velocity
		ballVelocity.x = GAME_CONFIG.canvasWidth * 0.6;
		ballVelocity.y = 0;
	}
}
