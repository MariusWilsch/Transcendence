'use client';
import * as PIXI from 'pixi.js';
import { GameState } from '../../../interfaces/GameState';
import { mapType } from '@/app/gamelobby/GlobalRedux/features';

export class GameService {
	//* Base variables
	private app: PIXI.Application;
	private mapChoice: number;
	//* Game elements
	private ball = new PIXI.Graphics();
	private leftPaddle = new PIXI.Graphics();
	private rightPaddle = new PIXI.Graphics();
	private map = new PIXI.Graphics();

	constructor(container: HTMLDivElement, mapChoice: number) {
		// Dynamically calculate canvas size
		const { width, height } = this.initCanvasSize();
		const options =
			mapChoice === mapType.STANDARD
				? { backgroundAlpha: 0 }
				: { background: 0x000000 };
		this.app = new PIXI.Application<HTMLCanvasElement>({
			width,
			height,
			antialias: true,
			...options,
		});
		container.appendChild(this.app.view as HTMLCanvasElement);
		this.mapChoice = mapChoice;
		this.mapChoice === mapType.STANDARD
			? this.drawMap1(width, height)
			: this.drawMap2(height);
	}

	private initCanvasSize() {
		let size = [window.innerWidth / 2, window.innerHeight / 2];
		const ratio = 16 / 9;
		let w, h;

		if (size[0] / size[1] >= ratio) {
			w = size[1] * ratio;
			h = size[1];
		} else {
			w = size[0];
			h = size[0] / ratio;
		}
		return { width: w, height: h };
	}

	public resizeHandler(gameState: GameState) {
		const { width, height } = this.initCanvasSize();
		this.app.renderer.resize(width, height);
		// Clear and redraw map and game elements to fit new size
		this.map.clear();
		this.mapChoice === mapType.STANDARD
			? this.drawMap1(width, height)
			: this.drawMap2(height);
		this.updateGameElements(gameState); // Make sure this method is adapted to redraw elements based on new size
	}

	private drawMap1(width: number, height: number) {
		// Set the line style (width, color)
		this.map.lineStyle(2, 0xffffff, 1);

		// Get the middle of the canvas
		const middleX = width / 2;
		const middleY = height / 2;

		// Draw a circle in the middle of the canvas
		const radius = 20;
		this.map.drawCircle(middleX, middleY, radius);
		// Draw a line from the top to the top edge of the circle
		this.map.moveTo(middleX, 0);
		this.map.lineTo(middleX, middleY - radius);

		// Draw a line from the bottom to the bottom edge of the circle
		this.map.moveTo(middleX, middleY + radius);
		this.map.lineTo(middleX, this.app.view.height);

		// Add the this.map to the stage
		this.app.stage.addChild(this.map);
	}

	private drawMap2(length: number) {
		this.map.lineStyle(2, 0xffffff, 1);
		const dashFrequency = 10 + 5;
		const dashCount = Math.floor(length / dashFrequency);
		const midX = this.app.view.width / 2;
		for (let i = 0; i <= dashCount; i++) {
			let lineStart = dashFrequency * i;
			this.map.moveTo(midX, lineStart);
			this.map.lineTo(midX, lineStart + 10);
		}
		this.app.stage.addChild(this.map);
	}

	public getScaleFactors(): { scaleX: number; scaleY: number } {
		const backendWidth = 600; // Virtual canvas width
		const backendHeight = 400; // Virtual canvas height
		const scaleX = this.app.screen.width / backendWidth;
		const scaleY = this.app.screen.height / backendHeight;
		return { scaleX, scaleY };
	}

	public initGameElements(
		ball: GameState['ball'],
		paddles: GameState['paddles'],
	) {
		// Initialize game elements with scaling
		this.drawBall(ball);
		this.drawPaddle(paddles.player1, 'left');
		this.drawPaddle(paddles.player2, 'right');
	}

	public updateGameElements({ ball, paddles }: GameState) {
		// Update game elements with dynamic scaling
		const { scaleX, scaleY } = this.getScaleFactors();
		// const interpolatedPosition = {
		// 	x: this.lerp(this.prevBallPosition.x, ball.position.x) * scaleX,
		// 	y: this.lerp(this.prevBallPosition.y, ball.position.y) * scaleY,
		// };
		// this.prevBallPosition = { ...ball.position };

		this.drawBall(ball);
		this.drawPaddle(
			{
				...paddles.player1,
				position: {
					x: paddles.player1.position.x * scaleX,
					y: paddles.player1.position.y * scaleY,
				},
			},
			'left',
		);
		this.drawPaddle(
			{
				...paddles.player2,
				position: {
					x: paddles.player2.position.x * scaleX,
					y: paddles.player2.position.y * scaleY,
				},
			},
			'right',
		);
	}

	// Implement drawBall and drawPaddle to use translated positions and potentially scaled sizes
	private drawBall(ballProps: GameState['ball']) {
		// Calculate scale factors for the current canvas size
		const { scaleX, scaleY } = this.getScaleFactors();

		// Scale the ball's position and radius according to the canvas size
		const scaledX = ballProps.position.x * scaleX;
		const scaledY = ballProps.position.y * scaleY;
		const scaledRadius = ballProps.radius * Math.min(scaleX, scaleY); // Use Math.min to keep the aspect ratio of the ball

		// Draw the ball with the scaled values
		this.ball.clear();
		this.ball.beginFill(0xffffff);
		this.ball.drawCircle(scaledX, scaledY, scaledRadius);
		this.ball.endFill();

		// Add the ball to the stage
		this.app.stage.addChild(this.ball);
	}

	private drawPaddle(
		paddleProps: GameState['paddles']['player1' | 'player2'],
		side: 'left' | 'right',
	) {
		// Determine which paddle graphic to use
		const paddle = side === 'left' ? this.leftPaddle : this.rightPaddle;

		// Calculate scale factors for the current canvas size
		const { scaleX, scaleY } = this.getScaleFactors();

		// Calculate the paddle's scaled width and height
		const scaledWidth = paddleProps.size.width * scaleX;
		const scaledHeight = paddleProps.size.height * scaleY;

		// Scale the paddle's position. For the right paddle, make sure it's positioned from the right edge of the canvas
		const scaledX =
			side === 'right'
				? this.app.screen.width - scaledWidth // Adjust position for the right paddle
				: paddleProps.position.x * scaleX; // Left paddle's position stays as it is

		const scaledY = paddleProps.position.y * scaleY;

		// Draw the paddle with the scaled values
		paddle.clear();
		paddle.beginFill(0xffffff); // Paddle color
		paddle.drawRoundedRect(scaledX, scaledY, scaledWidth, scaledHeight, 10); // Rounded corners
		paddle.endFill();

		// Ensure the paddle is added to the stage
		if (!this.app.stage.children.includes(paddle)) {
			this.app.stage.addChild(paddle);
		}

		// Log the scaled positions for debugging
		console.log(
			`Paddle ${side}: x=${scaledX}, y=${scaledY}, width=${scaledWidth}, height=${scaledHeight}`,
		);
	}
}

// 'use client';
// import * as PIXI from 'pixi.js';
// import { GameState } from '../../../interfaces/GameState';
// import { mapType } from '@/app/gamelobby/GlobalRedux/features';
// //* Decide later if I want to use this

// export class GameService {
// 	//* Base variables
// 	private app: PIXI.Application;
// 	// private container: HTMLDivElement;
// 	//* Game elements
// 	private ball = new PIXI.Graphics();
// 	private leftPaddle = new PIXI.Graphics();
// 	private rightPaddle = new PIXI.Graphics();
// 	private map = new PIXI.Graphics();
// 	private mapChoice: number;
// 	//* Lerp Variables
// 	private prevBallPosition: { x: number; y: number };
// 	private lastUpdateTime: number;
// 	private deltaTime: number = 0;

// 	//* Vars for FPS counter
// 	// private frameCount = 0;
// 	// private lastFpsCheck = Date.now();
// 	// private fps = 0;

// 	//* Vars for IDK
// 	private paddleWidthReductionInPx = 5;

// 	constructor(
// 		container: HTMLDivElement,
// 		width: number,
// 		height: number,
// 		mapChoice: number,
// 	) {
// 		const options =
// 			mapChoice === mapType.STANDARD
// 				? { backgroundAlpha: 0 }
// 				: { background: 0x000000 };
// 		this.app = new PIXI.Application<HTMLCanvasElement>({
// 			width,
// 			height,
// 			antialias: true, // Enable antialiasing
// 			// resizeTo: container, // Resize canvas to fit container
// 			...options,
// 			// autoDensity: true, // Should I use this/,
// 		});
// 		container.appendChild(this.app.view as HTMLCanvasElement);
// 		mapChoice === mapType.STANDARD ? this.drawMap1() : this.drawMap2(height);
// 		this.mapChoice = mapChoice;
// 		this.prevBallPosition = { x: 0, y: 0 };
// 		this.lastUpdateTime = performance.now(); // Get current time
// 		// this.nextUpdateTime = this.lastUpdateTime + 1000 / 60; // 60 FPS
// 		// this.container = container;
// 	}

// 	//* Private methods

// 	public resizeHandler(): { width: number; height: number } {
// 		let size = [window.innerWidth / 2, window.innerHeight / 2];
// 		let ratio = 16 / 9;
// 		let w, h;
// 		if (size[0] / size[1] >= ratio) {
// 			w = size[1] * ratio;
// 			h = size[1];
// 		} else {
// 			w = size[0];
// 			h = size[0] / ratio;
// 		}
// 		this.app.renderer.resize(w, h);
// 		this.map.clear();
// 		this.mapChoice === mapType.STANDARD ? this.drawMap1() : this.drawMap2(h);

// 		return { width: w, height: h };
// 	}

// 	private drawMap1() {
// 		// Set the line style (width, color)
// 		this.map.lineStyle(2, 0xffffff, 1);

// 		// Get the middle of the canvas
// 		const middleX = this.app.view.width / 2;
// 		const middleY = this.app.view.height / 2;

// 		// Draw a circle in the middle of the canvas
// 		const radius = 20;
// 		this.map.drawCircle(middleX, middleY, radius);
// 		// Draw a line from the top to the top edge of the circle
// 		this.map.moveTo(middleX, 0);
// 		this.map.lineTo(middleX, middleY - radius);

// 		// Draw a line from the bottom to the bottom edge of the circle
// 		this.map.moveTo(middleX, middleY + radius);
// 		this.map.lineTo(middleX, this.app.view.height);

// 		// Add the this.map to the stage
// 		this.app.stage.addChild(this.map);
// 	}

// 	private drawMap2(length: number) {
// 		this.map.lineStyle(2, 0xffffff, 1);
// 		const dashFrequency = 10 + 5;
// 		const dashCount = Math.floor(length / dashFrequency);
// 		const midX = this.app.view.width / 2;
// 		for (let i = 0; i <= dashCount; i++) {
// 			let lineStart = dashFrequency * i;
// 			this.map.moveTo(midX, lineStart);
// 			this.map.lineTo(midX, lineStart + 10);
// 		}
// 		this.app.stage.addChild(this.map);
// 	}

// 	private lerp(start: number, end: number, t: number) {
// 		return start * (1 - t) + end * t;
// 	}

// 	private drawBall(ballProps: GameState['ball']) {
// 		this.ball.clear();
// 		this.ball.beginFill(0xffffff);
// 		this.ball.drawCircle(
// 			ballProps.position.x,
// 			ballProps.position.y,
// 			ballProps.radius,
// 		);
// 		this.ball.endFill();
// 	}

// 	private drawPaddle(
// 		paddleProps: GameState['paddles']['player1' | 'player2'],
// 		side: 'left' | 'right',
// 	) {
// 		const paddle = side === 'left' ? this.leftPaddle : this.rightPaddle;

// 		paddle.clear();
// 		paddle.beginFill(0xffffff); // Change color to blue
// 		paddle.drawRoundedRect(
// 			paddleProps.position.x,
// 			paddleProps.position.y,
// 			paddleProps.size.width - this.paddleWidthReductionInPx,
// 			paddleProps.size.height,
// 			10,
// 		);
// 		paddle.endFill();
// 	}

// 	private fpsCounter(now: number) {
// 		// if (now - this.lastFpsCheck >= 1000) { // Check every second
// 		//     this.fps = this.frameCount;
// 		//     this.frameCount = 0;
// 		//     this.lastFpsCheck = now
// 		//     console.log(`FPS: ${this.fps}`);
// 		// }
// 	}

// 	//* Public methods

// 	public initGameElements(
// 		ball: GameState['ball'],
// 		paddles: GameState['paddles'],
// 	) {
// 		console.log('Initializing game elements');
// 		// Draw ball
// 		this.prevBallPosition = { ...ball.position };
// 		this.drawBall(ball);
// 		//! Add motion blur to ball
// 		// this.ball.filters = [new MotionBlurFilter([ball.velocity.x, ball.velocity.y], 2)];

// 		// Draw paddles
// 		this.drawPaddle(paddles.player1, 'left');
// 		this.drawPaddle(paddles.player2, 'right');

// 		// Add elements to stage
// 		this.app.stage.addChild(this.ball, this.leftPaddle, this.rightPaddle);
// 	}

// 	public updateGameElements({ ball, paddles }: GameState) {
// 		//* Update ball with dynamic time lerp
// 		const now = performance.now();
// 		this.deltaTime = now - this.lastUpdateTime;
// 		this.lastUpdateTime = now;

// 		const t = Math.min(this.deltaTime / 100, 1); // 100 = Interpolation duration

// 		//* Frame independent time
// 		const interpolatedPosition = {
// 			x: this.lerp(this.prevBallPosition.x, ball.position.x, t),
// 			y: this.lerp(this.prevBallPosition.y, ball.position.y, t),
// 		};
// 		this.prevBallPosition = { ...ball.position };

// 		this.drawBall({ ...ball, position: interpolatedPosition });
// 		// this.frameCount++;
// 		// this.fpsCounter(now);
// 		//* Update without frame independent time lerp
// 		// this.drawBall(ball);

// 		// Update paddles
// 		this.drawPaddle(paddles.player1, 'left');
// 		this.drawPaddle(paddles.player2, 'right');
// 	}
// }
