'use client';
import * as PIXI from 'pixi.js';
import { GameState } from '../../../interfaces/GameState';
import { mapType } from '@/app/gamelobby/GlobalRedux/features';
//* Decide later if I want to use this
// import { MotionBlurFilter } from '@pixi/filter-motion-blur';

export class GameService {
	//* Base variables
	private app: PIXI.Application;
	// private container: HTMLDivElement;
	//* Game elements
	private ball = new PIXI.Graphics();
	private leftPaddle = new PIXI.Graphics();
	private rightPaddle = new PIXI.Graphics();
	//* Lerp Variables
	private prevBallPosition: { x: number; y: number };
	private lastUpdateTime: number;
	private deltaTime: number = 0;

	//* Vars for FPS counter
	// private frameCount = 0;
	// private lastFpsCheck = Date.now();
	// private fps = 0;

	//* Vars for IDK
	private paddleWidthReductionInPx = 5;

	constructor(
		container: HTMLDivElement,
		width: number,
		height: number,
		mapChoice: number,
	) {
		const options =
			mapChoice === mapType.STANDARD
				? { backgroundAlpha: 0 }
				: { background: 0x000000 };
		this.app = new PIXI.Application<HTMLCanvasElement>({
			width: width,
			height: height,
			antialias: true, // Enable antialiasing
			// resizeTo: container, // Resize canvas to fit container
			...options,
			// autoDensity: true, // Should I use this/,
		});
		container.appendChild(this.app.view as HTMLCanvasElement);
		mapChoice === mapType.STANDARD ? this.drawMap1() : this.drawMap2(height);
		this.prevBallPosition = { x: 0, y: 0 };
		this.lastUpdateTime = performance.now(); // Get current time
		// this.nextUpdateTime = this.lastUpdateTime + 1000 / 60; // 60 FPS
		// this.container = container;
	}

	//* Private methods

	private drawMap1() {
		const graphics = new PIXI.Graphics();

		// Set the line style (width, color)
		graphics.lineStyle(2, 0xffffff, 1);

		// Get the middle of the canvas
		const middleX = this.app.view.width / 2;
		const middleY = this.app.view.height / 2;

		// Draw a circle in the middle of the canvas
		const radius = 20;
		graphics.drawCircle(middleX, middleY, radius);
		// Draw a line from the top to the top edge of the circle
		graphics.moveTo(middleX, 0);
		graphics.lineTo(middleX, middleY - radius);

		// Draw a line from the bottom to the bottom edge of the circle
		graphics.moveTo(middleX, middleY + radius);
		graphics.lineTo(middleX, this.app.view.height);

		// Add the graphics to the stage
		this.app.stage.addChild(graphics);
	}

	private drawMap2(length: number) {
		const graphics = new PIXI.Graphics();

		graphics.lineStyle(2, 0xffffff, 1);
		const dashFrequency = 10 + 5;
		const dashCount = Math.floor(length / dashFrequency);
		const midX = this.app.view.width / 2;
		for (let i = 0; i <= dashCount; i++) {
			let lineStart = dashFrequency * i;
			graphics.moveTo(midX, lineStart);
			graphics.lineTo(midX, lineStart + 10);
		}
		this.app.stage.addChild(graphics);
	}

	private lerp(start: number, end: number, t: number) {
		return start * (1 - t) + end * t;
	}

	private drawBall(ballProps: GameState['ball']) {
		this.ball.clear();
		this.ball.beginFill(0xffffff);
		this.ball.drawCircle(
			ballProps.position.x,
			ballProps.position.y,
			ballProps.radius,
		);
		this.ball.endFill();
	}

	private drawPaddle(
		paddleProps: GameState['paddles']['player1' | 'player2'],
		side: 'left' | 'right',
	) {
		const paddle = side === 'left' ? this.leftPaddle : this.rightPaddle;

		paddle.clear();
		paddle.beginFill(0xffffff); // Change color to blue
		paddle.drawRoundedRect(
			paddleProps.position.x,
			paddleProps.position.y,
			paddleProps.size.width - this.paddleWidthReductionInPx,
			paddleProps.size.height,
			10,
		);
		paddle.endFill();
	}

	private fpsCounter(now: number) {
		// if (now - this.lastFpsCheck >= 1000) { // Check every second
		//     this.fps = this.frameCount;
		//     this.frameCount = 0;
		//     this.lastFpsCheck = now
		//     console.log(`FPS: ${this.fps}`);
		// }
	}

	//* Public methods

	public initGameElements(
		ball: GameState['ball'],
		paddles: GameState['paddles'],
	) {
		console.log('Initializing game elements');
		// Draw ball
		this.prevBallPosition = { ...ball.position };
		this.drawBall(ball);
		//! Add motion blur to ball
		// this.ball.filters = [new MotionBlurFilter([ball.velocity.x, ball.velocity.y], 2)];

		// Draw paddles
		this.drawPaddle(paddles.player1, 'left');
		this.drawPaddle(paddles.player2, 'right');

		// Add elements to stage
		this.app.stage.addChild(this.ball, this.leftPaddle, this.rightPaddle);
	}

	public updateGameElements({ ball, paddles }: GameState) {
		//* Update ball with dynamic time lerp
		const now = performance.now();
		this.deltaTime = now - this.lastUpdateTime;
		this.lastUpdateTime = now;

		const t = Math.min(this.deltaTime / 100, 1); // 100 = Interpolation duration

		//* Frame independent time
		const interpolatedPosition = {
			x: this.lerp(this.prevBallPosition.x, ball.position.x, t),
			y: this.lerp(this.prevBallPosition.y, ball.position.y, t),
		};
		this.prevBallPosition = { ...ball.position };

		this.drawBall({ ...ball, position: interpolatedPosition });
		// this.frameCount++;
		// this.fpsCounter(now);
		//* Update without frame independent time lerp
		// this.drawBall(ball);

		// Update paddles
		this.drawPaddle(paddles.player1, 'left');
		this.drawPaddle(paddles.player2, 'right');
	}

	// adjustPaddlePosition(
	// 	gameState: GameState,
	// 	newCanvasWidth: number,
	// 	newCanvasHeight: number,
	// ) {
	// 	const paddles = gameState.paddles;
	// 	// Adjust the y position for both paddles to ensure they stay within the new canvas height
	// 	paddles.player1.position.y = Math.max(
	// 		0,
	// 		Math.min(
	// 			paddles.player1.position.y,
	// 			newCanvasHeight - paddles.player1.size.height,
	// 		),
	// 	);
	// 	paddles.player2.position.y = Math.max(
	// 		0,
	// 		Math.min(
	// 			paddles.player2.position.y,
	// 			newCanvasHeight - paddles.player2.size.height,
	// 		),
	// 	);

	// 	// Adjust the x position of the right paddle (player2) based on the new canvas width
	// 	paddles.player2.position.x = newCanvasWidth - paddles.player2.size.width;
	// }

	// adjustBallPosition(
	// 	gameState: GameState,
	// 	newCanvasWidth: number,
	// 	newCanvasHeight: number,
	// ) {
	// 	const ball = gameState.ball;
	// 	// Adjust the ball position to ensure it remains within the resized canvas bounds
	// 	ball.position.x = Math.max(
	// 		ball.radius,
	// 		Math.min(ball.position.x, newCanvasWidth - ball.radius),
	// 	);
	// 	ball.position.y = Math.max(
	// 		ball.radius,
	// 		Math.min(ball.position.y, newCanvasHeight - ball.radius),
	// 	);
	// }

	// public resizeGame(gameState: GameState, newWidth: number, newHeight: number) {
	// 	// Resize the PIXI application
	// 	this.app.renderer.resize(newWidth, newHeight);

	// 	// Adjust paddles and ball positions
	// 	this.adjustPaddlePosition(gameState, newWidth, newHeight);
	// 	this.adjustBallPosition(gameState, newWidth, newHeight);

	// 	// Update gameState with new canvas dimensions
	// 	gameState.canvasWidth = newWidth;
	// 	gameState.canvasHeight = newHeight;

	// 	// Other necessary adjustments (e.g., velocity adjustments, aspect ratio considerations)
	// }
}
