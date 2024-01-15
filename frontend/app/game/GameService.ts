import * as PIXI from 'pixi.js';
import { GameState } from '../GlobalRedux/features';
import { MotionBlurFilter } from '@pixi/filter-motion-blur';

export class GameService {
	//* Base variables
	private app: PIXI.Application;
	private container: HTMLDivElement;
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

	constructor(container: HTMLDivElement, width: number, height: number) {
		this.container = container;
		this.app = new PIXI.Application<HTMLCanvasElement>({
			width: width,
			height: height,
			backgroundAlpha: 0, // Set background color to transparent
			antialias: true, // Enable antialiasing
			resolution: 1, // Should I use this/,

			// autoDensity: true, // Should I use this/,
		});
		container.appendChild(this.app.view as HTMLCanvasElement);
		this.drawCanvasSnickSnack();
		this.prevBallPosition = { x: 0, y: 0 };
		this.lastUpdateTime = performance.now(); // Get current time
		// this.nextUpdateTime = this.lastUpdateTime + 1000 / 60; // 60 FPS
	}

	//* Private methods

	private drawCanvasSnickSnack() {
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

	public updateGameElements({ ball, paddles, score }: GameState) {
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

		// Update scores
		// if (score.player1 !== this.prevScores.player1) {
		// 	this.scores.player1.text = score.player1.toString();
		// } else if (score.player2 !== this.prevScores.player2) {
		// 	this.scores.player2.text = score.player2.toString();
		// }
		// this.prevScores = score;
	}

	public clearGameElements() {
		console.log('Clearing game elements');
		if (this.app) {
			this.container.removeChild(this.app.view as HTMLCanvasElement);
			this.app.destroy(true, true);
		}
	}
}
// export class GameService {
// 	private app: PIXI.Application;
// 	private ball = new PIXI.Graphics();
// 	private leftPaddle = new PIXI.Graphics();
// 	private rightPaddle = new PIXI.Graphics();
// 	private container: HTMLDivElement;
// 	private scores: {
// 		player1: PIXI.Text;
// 		player2: PIXI.Text;
// 	};
// 	private prevScores: GameState['score'];
// 	private prevBallPosition: { x: number, y: number } = { x: 0, y: 0 };
// 	private prevBallTimestamp: number = Date.now();

// 	constructor(container: HTMLDivElement, width: number, height: number) {
// 		this.container = container;
// 		this.app = new PIXI.Application<HTMLCanvasElement>({
// 			width: width,
// 			height: height,
// 			backgroundColor: 0xFFFFFF, // Set background color to white
// 			antialias: true, // Enable antialiasing
// 		});
// 		container.appendChild(this.app.view as HTMLCanvasElement);
// 		this.scores = {
// 			player1: new PIXI.Text('0', {
// 					fontFamily: 'Arial',
// 					fontSize: 36,
// 					fontStyle: 'italic',
// 					fontWeight: 'bold',
// 					fill: ['#ffffff'],
// 					stroke: '#4a1850',
// 					strokeThickness: 5,
// 			}),
// 			player2: new PIXI.Text('0', {
// 					fontFamily: 'Arial',
// 					fontSize: 36,
// 					fontStyle: 'italic',
// 					fontWeight: 'bold',
// 					fill: ['#ffffff'],
// 					stroke: '#4a1850',
// 					strokeThickness: 5,
// 			}),
// 		};
// 		this.scores.player1.position.set(width / 2 - 50, 20);
// 		this.scores.player2.position.set(width / 2 + 50, 20);
// 		this.app.stage.addChild(this.scores.player1, this.scores.player2);
// 		this.prevScores = {
// 			player1: 0,
// 			player2: 0,
// 		};
// 	}

// 	//* Private methods

// 	private drawBall(ballProps: GameState['ball']) {
// 		this.ball.clear();
// 		this.ball.beginFill(0xFF0000); // Change color to blue
// 		this.ball.drawCircle(ballProps.position.x, ballProps.position.y, ballProps.radius);
// 		this.ball.endFill();

// 	}

// 	private drawPaddle(paddleProps: GameState['paddles']['player1' | 'player2'], side: 'left' | 'right') {
// 		const paddle = side === 'left' ? this.leftPaddle : this.rightPaddle;
// 		paddle.clear();
// 		paddle.beginFill(0x0000FF); // Change color to blue
// 		paddle.drawRect(paddleProps.position.x, paddleProps.position.y, paddleProps.size.width, paddleProps.size.height);
// 		paddle.endFill();
// 	}

// 	private lerp(start: number, end: number, amt: number) {
//     return (1 - amt) * start + amt * end;
// }

// 	//* Public methods

// 	public initGameElements(ball: GameState['ball'], paddles: GameState['paddles']) {
// 		console.log('Initializing game elements');
// 		// Draw ball
// 		this.drawBall(ball);
// 		// this.prevBallPosition = { ...ball.position };
// 		//! Add motion blur to ball
// 		// this.ball.filters = [new MotionBlurFilter([ball.velocity.x, ball.velocity.y], 2)];

// 		// Draw paddles
// 		this.drawPaddle(paddles.player1, 'left');
// 		this.drawPaddle(paddles.player2, 'right');

// 		// Add elements to stage
// 		this.app.stage.addChild(this.ball, this.leftPaddle, this.rightPaddle);
// 	}

// 	public updateGameElements({ball, paddles, score} :GameState) {
// 		console.log('Updating game elements');
// 		const elapsedTime = Date.now() - this.prevBallTimestamp;
// 		const totalTime = performance.now() - this.prevBallTimestamp;
// 		const lerpAmount = elapsedTime / totalTime;

// 		  // Calculate interpolated position
//     const interpolatedPosition = {
//       x: this.lerp(this.prevBallPosition.x, ball.position.x, lerpAmount),
//       y: this.lerp(this.prevBallPosition.y, ball.position.y, lerpAmount),
//     };

// 		this.prevBallPosition = { ...ball.position };
// 		this.prevBallTimestamp = performance.now();

// 		this.drawBall({ ...ball, position: interpolatedPosition });

// 		// Update paddles
// 		this.drawPaddle(paddles.player1, 'left');
// 		this.drawPaddle(paddles.player2, 'right');

// 		// Update scores
// 		if (score.player1 !== this.prevScores.player1) {
// 			this.scores.player1.text = score.player1.toString();
// 		} else if (score.player2 !== this.prevScores.player2) {
// 			this.scores.player2.text = score.player2.toString();
// 		}
// 		this.prevScores = score;
// 	}

// 	public clearGameElements() {
// 		console.log('Clearing game elements');
// 		if (this.app) {
// 			this.container.removeChild(this.app.view as HTMLCanvasElement);
// 			this.app.destroy(true, true)
// 		}
// 	}
// }
