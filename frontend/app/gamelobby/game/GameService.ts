'use client';
import * as PIXI from 'pixi.js';
import { GameState } from '../../../interfaces/GameState';
import { mapType } from '@/app/gamelobby/GlobalRedux/features';
//* Decide later if I want to use this

export class GameService {
	//* Base variables
	private app: PIXI.Application;
	// private container: HTMLDivElement;
	//* Game elements
	private ball = new PIXI.Graphics();
	private leftPaddle = new PIXI.Graphics();
	private rightPaddle = new PIXI.Graphics();
	private map = new PIXI.Graphics();
	private mapChoice: number;
	//* Lerp Variables

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
			width,
			height,
			antialias: true, // Enable antialiasing
			// resizeTo: container, // Resize canvas to fit container
			...options,
			// autoDensity: true, // Should I use this/,
		});
		container.appendChild(this.app.view as HTMLCanvasElement);
		mapChoice === mapType.STANDARD ? this.drawMap1() : this.drawMap2(height);
		this.mapChoice = mapChoice;
		// this.nextUpdateTime = this.lastUpdateTime + 1000 / 60; // 60 FPS
		// this.container = container;
	}

	//* Private methods

	public resizeHandler(): { width: number; height: number } {
		let size = [window.innerWidth / 2, window.innerHeight / 2];
		let ratio = 3 / 2; // Updated ratio to 3:2
		let width, height;
		if (size[0] / size[1] >= ratio) {
			width = size[1] * ratio;
			height = size[1];
		} else {
			width = size[0];
			height = size[0] / ratio;
		}
		this.app.renderer.resize(width, height);
		this.map.clear();
		this.mapChoice === mapType.STANDARD ? this.drawMap1() : this.drawMap2(height);

		return { width, height };
	}

	private drawMap1() {
		// Set the line style (width, color)
		this.map.lineStyle(2, 0xffffff, 1);

		// Get the middle of the canvas
		const middleX = this.app.view.width / 2;
		const middleY = this.app.view.height / 2;

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
		//     // console.log(`FPS: ${this.fps}`);
		// }
	}

	//* Public methods

	public initGameElements(
		ball: GameState['ball'] | null,
		paddles: GameState['paddles'] | null,
	) {
		// console.log('Initializing game elements');
		// Draw ball
		if (!ball || !paddles) return;
		this.drawBall(ball);
		//! Add motion blur to ball
		// this.ball.filters = [new MotionBlurFilter([ball.velocity.x, ball.velocity.y], 2)];

		// Draw paddles
		this.drawPaddle(paddles.player1, 'left');
		this.drawPaddle(paddles.player2, 'right');

		// Add elements to stage
		this.app.stage.addChild(this.ball, this.leftPaddle, this.rightPaddle);
	}

	public updateGameElements(
		ball: GameState['ball'] | null,
		paddles: GameState['paddles'] | null,
	) {
		if (!ball || !paddles) return;

		this.drawBall(ball);
		// this.frameCount++;
		// this.fpsCounter(now);
		//* Update without frame independent time lerp
		// this.drawBall(ball);

		// Update paddles
		this.drawPaddle(paddles.player1, 'left');
		this.drawPaddle(paddles.player2, 'right');
	}

	public getCanvasSize() {
		return { width: this.app.view.width, height: this.app.view.height };
	}
}
