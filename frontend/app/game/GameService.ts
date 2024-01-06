import * as PIXI from 'pixi.js';
import { GameState } from '../GlobalRedux/features';

export class GameService {
	private app: PIXI.Application;
	private ball = new PIXI.Graphics();
	private leftPaddle = new PIXI.Graphics();
	private rightPaddle = new PIXI.Graphics();
	private container: HTMLDivElement;
	// private isGameCleared = false;

	constructor(container: HTMLDivElement, width: number, height: number) {
		this.container = container;
		this.app = new PIXI.Application<HTMLCanvasElement>({
			width: width,
			height: height,
			backgroundColor: 0xFFFFFF, // Set background color to white
			antialias: true, // Enable antialiasing
		});
		container.appendChild(this.app.view as HTMLCanvasElement);
	}

	//* Private methods

	private drawBall(ballProps: GameState['ball']) {
		this.ball.clear();
		this.ball.beginFill(0xFF0000); // Change color to blue
		this.ball.drawCircle(ballProps.position.x, ballProps.position.y, ballProps.radius);
		this.ball.endFill();
	}
	
	private drawPaddle(paddleProps: GameState['paddles']['player1' | 'player2'], side: 'left' | 'right') {
		const paddle = side === 'left' ? this.leftPaddle : this.rightPaddle;
		paddle.clear();
		paddle.beginFill(0x0000FF); // Change color to blue
		paddle.drawRect(paddleProps.position.x, paddleProps.position.y, paddleProps.size.width, paddleProps.size.height);
		paddle.endFill();
	}

	//* Public methods

	public initGameElements(ballProps: GameState['ball'], paddles: GameState['paddles']) {
		console.log('Initializing game elements');
		// Draw ball
		this.drawBall(ballProps);

		// Draw paddles
		this.drawPaddle(paddles.player1, 'left');
		this.drawPaddle(paddles.player2, 'right');

		// Add elements to stage
		this.app.stage.addChild(this.ball, this.leftPaddle, this.rightPaddle);
		this.isGameCleared = false;
	}

	public updateGameElements(ballProps: GameState['ball'], paddles: GameState['paddles']) {
		// if (!this.isGameCleared) return
		// console.log('Updating game elements');
		// Update ball
		this.drawBall(ballProps);

		// Update paddles
		this.drawPaddle(paddles.player1, 'left');
		this.drawPaddle(paddles.player2, 'right');
	}

	public clearGameElements() {
		if (this.isGameCleared) return
		console.log('Clearing game elements');
		if (this.app) {
			this.container.removeChild(this.app.view as HTMLCanvasElement);
			this.app.destroy()
			// this.isGameCleared = true;
		}
	}

}

