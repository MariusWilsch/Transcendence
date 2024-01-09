import * as PIXI from 'pixi.js';
import { GameState } from '../GlobalRedux/features';
import { MotionBlurFilter } from '@pixi/filter-motion-blur';

export class GameService {
	private app: PIXI.Application;
	private ball = new PIXI.Graphics();
	private leftPaddle = new PIXI.Graphics();
	private rightPaddle = new PIXI.Graphics();
	private container: HTMLDivElement;
	private scores: {
		player1: PIXI.Text;
		player2: PIXI.Text;
	};
	private prevScores: GameState['score'];
	private prevBallPosition: { x: number, y: number } = { x: 0, y: 0 };
	private letAmpt = 0.1;

	constructor(container: HTMLDivElement, width: number, height: number) {
		this.container = container;
		this.app = new PIXI.Application<HTMLCanvasElement>({
			width: width,
			height: height,
			backgroundColor: 0xFFFFFF, // Set background color to white
			antialias: true, // Enable antialiasing
		});
		container.appendChild(this.app.view as HTMLCanvasElement);
		this.scores = {
			player1: new PIXI.Text('0', {
					fontFamily: 'Arial',
					fontSize: 36,
					fontStyle: 'italic',
					fontWeight: 'bold',
					fill: ['#ffffff'],
					stroke: '#4a1850',
					strokeThickness: 5,
			}),
			player2: new PIXI.Text('0', {
					fontFamily: 'Arial',
					fontSize: 36,
					fontStyle: 'italic',
					fontWeight: 'bold',
					fill: ['#ffffff'],
					stroke: '#4a1850',
					strokeThickness: 5,
			}),
		};
		this.scores.player1.position.set(width / 2 - 50, 20);
		this.scores.player2.position.set(width / 2 + 50, 20);
		this.app.stage.addChild(this.scores.player1, this.scores.player2);
		this.prevScores = {
			player1: 0,
			player2: 0,
		};
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

	private lerp(start: number, end: number, amt: number) {
    return (1 - amt) * start + amt * end;
}

	//* Public methods

	public initGameElements(ball: GameState['ball'], paddles: GameState['paddles']) {
		console.log('Initializing game elements');
		// Draw ball
		this.drawBall(ball);
		this.prevBallPosition = { ...ball.position };
		//! Add motion blur to ball
		// this.ball.filters = [new MotionBlurFilter([ball.velocity.x, ball.velocity.y], 2)];

		// Draw paddles
		this.drawPaddle(paddles.player1, 'left');
		this.drawPaddle(paddles.player2, 'right');

		// Add elements to stage
		this.app.stage.addChild(this.ball, this.leftPaddle, this.rightPaddle);
	}

	public updateGameElements({ball, paddles, score} :GameState) {
		// console.log('Updating game elements');
		// Calculate new position
    // let newX = this.lerp(this.prevBallPosition.x, ball.position.x, this.lerpAmt);
    // let newY = this.lerp(this.prevBallPosition.y, ball.position.y, this.lerpAmt);

    // Update the ball's position for drawing
    // this.prevBallPosition = { x: newX, y: newY };

    // Draw the ball at the new interpolated position
		// this.drawBall({ ...ball, position: { x: newX, y: newY } });
		// Update Ball
		this.drawBall(ball);

		// Update paddles
		this.drawPaddle(paddles.player1, 'left');
		this.drawPaddle(paddles.player2, 'right');

		// Update scores	
		if (score.player1 !== this.prevScores.player1) {
			this.scores.player1.text = score.player1.toString();
		} else if (score.player2 !== this.prevScores.player2) {
			this.scores.player2.text = score.player2.toString();
		}
		this.prevScores = score;
	}

	public clearGameElements() {
		console.log('Clearing game elements');
		if (this.app) {
			this.container.removeChild(this.app.view as HTMLCanvasElement);
			this.app.destroy(true, true)
		}
	}
}

