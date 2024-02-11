import { Injectable } from '@nestjs/common';
import { GAME_CONFIG } from './helpers/game.constants';
import {
	GameSession,
	GameState,
	Paddle,
	Ball,
	Vector,
	Size,
	PlayerInput,
	Player,
	PlayerMove,
	Direction,
	GameConfigState,
	InputType,
	GameResult,
	MatchOutcome,
	Players,
} from './helpers/interfaces';
import { Socket } from 'socket.io';
import { createCommand } from './helpers/inputCommand';
import { PrismaClient } from '@prisma/client';
//! What is the right way to import this?

const prisma = new PrismaClient();

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

	public createGameSession(
		roomID: string,
		player1: Socket,
		player2: Socket,
		userData: GameSession['userData']
	) {
		// Join both Sockets to a Socket.io room
		player1.join(roomID);
		player2.join(roomID);

		// Associate the room ID and PlayerID with each Socket
		player1.data = { ...player1.data, roomID, playerID: Player.P1 };
		player2.data = { ...player2.data, roomID, playerID: Player.P2 };

		const aiMatch = userData[0].username === 'Computer' ? true : false;

		// Create a new game session and store it in the Map
		this.gameSessions.set(roomID, {
			ballVelocity: createVec2(
				GAME_CONFIG.canvasWidth * GAME_CONFIG.ballSpeedFactor,
				0
			),
			//! Strings need to be changed to the actual ID's but how do I get them?
			players: [
				{ playerIDs: player1.data.user.intraId, playerSockets: player1 },
				{ playerIDs: player2.data.user.intraId, playerSockets: player2 },
			],
			gameState: this.initGameState(),
			intervalID: undefined,
			input: [
				{
					up: false,
					down: false,
					yPos: GAME_CONFIG.canvasHeight / 2 - GAME_CONFIG.paddleHeight / 2,
				},
				{
					up: false,
					down: false,
					yPos: GAME_CONFIG.canvasHeight / 2 - GAME_CONFIG.paddleHeight / 2,
				},
			],
			command: [],
			userData,
			aiMatch: aiMatch,
		});
	}

	private initGameState() {
		const { paddleWidth, paddleHeight, ballRadius, canvasWidth, canvasHeight } =
			GAME_CONFIG;
		this.paddleSpeed = canvasHeight / 1;
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
	public updateGameState(gameSession: GameSession, deltaTime: number): boolean {
		// if (this.gameSessions.size == 0) return;
		// if (
		// 	gameSession.command[0] === undefined ||
		// 	gameSession.command[1] === undefined
		// )
		// 	return false;
		this.updatePaddles(gameSession, deltaTime);
		this.updateBall(gameSession.gameState, gameSession.ballVelocity, deltaTime);
		if (!this.isBallCloseToPaddle(gameSession.gameState.ball)) return;
		this.checkPaddleCollision(
			gameSession,
			this.choosePaddle(gameSession.gameState.ball)
		);
	}
	//! This is the tested version. I'm tring to see what happens if I do updatePaddles first
	// public updateGameState(gameSession: GameSession, deltaTime: number) {
	// 	if (this.gameSessions.size == 0) return;
	// 	this.updateBall(gameSession.gameState, gameSession.ballVelocity, deltaTime);
	// 	this.updatePaddles(gameSession, deltaTime);
	// 	if (!this.isBallCloseToPaddle(gameSession.gameState.ball)) return;
	// 	this.checkPaddleCollision(
	// 		gameSession,
	// 		this.choosePaddle(gameSession.gameState.ball)
	// 	);
	// }

	//* Private

	private updateBall(
		{ ball, score }: GameState,
		ballVelocity: Vector,
		deltaTime: number
	): void {
		// // console.log('Ball state before sending', ball);
		// // console.log("Ball's velocity before sending", ballVelocity);

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
	//! Needs testing
	private updatePaddles(
		{ gameState, command, input }: GameSession,
		deltaTime: number
	) {
		let didPaddleMove = false;

		//* Update player 1's paddle
		didPaddleMove = command[Player.P1].execute(deltaTime, input[Player.P1]);
		//* Update player 2's paddle
		didPaddleMove = command[Player.P2].execute(deltaTime, input[Player.P2]);
		//* Early return if the paddle did not move to prevent unnecessary calculations
		if (!didPaddleMove) return;
		this.preventPaddleOverlap(
			gameState.paddles.player1,
			gameState.paddles.player2
		);
	}

	//! Is that at all doing something?

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
	//! imporve collsion so I can fasten the ball
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

	//! This function is still subject to change
	public deleteGameSession(clientID: string, roomID: string): void {
		if (this.gameSessions.size == 0) return;
		const gameSession = this.gameSessions.get(roomID);
		// console.log('Client was in a room, deleting game session...');

		if (gameSession) {
			// Remove the game session
			this.gameSessions.delete(roomID);
			// Disconnect the other player
			const otherPlayer = gameSession.players.find(
				(player) => player.playerIDs !== clientID
			);
			if (otherPlayer) {
				// console.log('Disconnecting other player...');
				otherPlayer.playerSockets.emit('test');
				otherPlayer.playerSockets.disconnect();
			}
		}
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

	private createGameResult(
		winnerIndex: number,
		loserIndex: number,
		scoreAsString: string,
		players: Players[]
	): GameResult {
		return {
			winnerId: players[winnerIndex].playerIDs,
			loserId: players[loserIndex].playerIDs,
			score: scoreAsString,
			result: winnerIndex === 0 ? [true, false] : [false, true],
			outcome: MatchOutcome.FINISHED,
		};
	}

	public getWinner(players: Players[], { score }: GameState): GameResult {
		const scoreAsString = `${score.player1}${score.player2}`;

		if (score.player1 === GAME_CONFIG.WinningScore) {
			return this.createGameResult(1, 0, scoreAsString, players);
		} else {
			return this.createGameResult(0, 1, scoreAsString, players);
		}
	}

	//* Setters

	//! I need to decide if allow to players who have different input types to play together
	//! If yes then the way the function is build is okay.
	//! If not I can just return both commands in a object and return them into the game session
	public setCommand(
		{ inputType, aiDifficulty }: GameConfigState,
		{ gameState, command }: GameSession,
		playerRole: Player
	) {
		const { paddles, ball } = gameState;

		if (inputType === InputType.AI) {
			// console.log('AI Match detected');
			playerRole = Player.P1;
		}

		command[playerRole] = createCommand(inputType, {
			paddle: playerRole === Player.P1 ? paddles.player1 : paddles.player2,
			speed: this.paddleSpeed,
			ball,
			difficulty: aiDifficulty,
		});
	}

	public setIntervalID(roomID: string, intervalID: NodeJS.Timeout) {
		if (this.gameSessions.size == 0) return;
		this.gameSessions.get(roomID).intervalID = intervalID;
	}

	public setKeyboardInput(input: PlayerInput, { direction }: PlayerMove) {
		switch (direction) {
			case Direction.UP:
				input.up = true;
				break;
			case Direction.DOWN:
				input.down = true;
				break;
			case Direction.STOP:
				input.up = false;
				input.down = false;
				break;
		}
	}

	public setMouseInput(input: PlayerInput, { yPos }: PlayerMove) {
		if (yPos) input.yPos = yPos;
	}

	//* Helpers

	private choosePaddle(ball: Ball): string {
		return ball.position.x < GAME_CONFIG.canvasWidth / 2
			? 'player1'
			: 'player2';
	}

	/**
	 * The function checks if a game room exists based on the provided room ID.
	 * @param {string} roomID - A string representing the ID of a game room.
	 * @returns a boolean value.
	 */
	public isInGame(roomID: string): boolean {
		// if (this.gameSessions.size == 0) return false;
		return this.gameSessions.get(roomID)?.intervalID !== undefined;
	}

	public isCommandSet(roomID: string): boolean {
		if (this.gameSessions.size === 0) return;
		return this.gameSessions.get(roomID).command.length === 2;
	}

	public hasRoom(roomID: string): boolean {
		return this.gameSessions.has(roomID);
	}

	public areCommandsSet(roomID: string): boolean {
		let bool;

		bool = this.gameSessions.get(roomID).command.length === 2;
		bool = this.gameSessions.get(roomID).command[0] !== undefined;
		bool = this.gameSessions.get(roomID).command[1] !== undefined;
		return bool;
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

	async saveMatchResult(
		{ userData }: GameSession,
		winnerId: string,
		loserId: string,
		score: string
	) {
		return prisma.matchHistory.create({
			data: {
				winnerId,
				loserId,
				score,
				user1Avatar: userData[0].avatar,
				user1Login: userData[0].username,
				user2Login: userData[1].username,
				user2Avatar: userData[1].avatar,
			},
		});
	}

	public getCommmand(roomID: string): any {
		if (this.gameSessions.size === 0) return false;
		return this.gameSessions.get(roomID).command;
	}

	public checkCommands(roomID: string): boolean {
		const gameSession = this.gameSessions.get(roomID);
		if (!gameSession.command)
			return false;

		if (gameSession.command.length === 2) {
			return true;
		}
		if (
			gameSession.command[0] !== undefined ||
			gameSession.command[1] !== undefined
		) {
			return true;
		}
		return false;
	}
}
