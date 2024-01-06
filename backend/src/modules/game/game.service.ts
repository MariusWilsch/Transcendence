import { Injectable } from '@nestjs/common';
import { GAME_CONFIG } from './game.constants';
import { GameState } from './interfaces';

// Helper functions
const createVec2 = (x: number, y: number) => ({ x, y });

const createSize = (width: number, height: number) => ({ width, height });

@Injectable()
export class GameService {
	private gameState: GameState;

	public initGameState() {
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
