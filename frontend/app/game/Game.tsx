'use client';
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

interface gameVars {
	backgroundColor: number;
	// Paddle
	paddleWidth: number;
	paddleHeight: number;
	paddleColor: number;
	paddleVelocity: number;
	// Ball
	ballColor: number;
	ballRadius: number;
	ballVelocityX: number;
	ballVelocityY: number;
	playerScores: { player1: number; player2: number };
}

const gameVars = {
	// backgroundColor: 0x1099bb,
	paddleWidth: 20,
	paddleHeight: 100,
	paddleColor: 0xde3249,
	paddleVelocity: 10,
	ballColor: 0xffffff,
	ballRadius: 20,
	ballVelocityX: 5,
	ballVelocityY: 5,
	playerScores: { player1: 0, player2: 0 },
};

interface vec2 {
	x: number;
	y: number;
}

const createVec2 = (x: number, y: number) => ({ x, y });

interface PaddleProps {
	pos: vec2;
	width: number;
	height: number;
	color: number;
	input: { up: boolean; down: boolean };
}

class Paddle implements PaddleProps {
	pos: vec2;
	width: number;
	height: number;
	color: number;
	input: { up: boolean; down: boolean };

	constructor(
		pos: vec2,
		width: number,
		height: number,
		color: number,
		input: { up: boolean; down: boolean } = { up: false, down: false },
	) {
		this.pos = pos;
		this.width = width;
		this.height = height;
		this.color = color;
		this.input = input;
	}
	getCenter() {
		return createVec2(
			this.pos.x + this.width / 2,
			this.pos.y + this.height / 2,
		);
	}
	getHalfWidth() {
		return this.width / 2;
	}
	getHalfHeight() {
		return this.height / 2;
	}
	draw(graphics: PIXI.Graphics) {
		if (this.pos.y <= 0) this.pos.y = 0;
		if (this.pos.y >= window.innerHeight - this.height)
			this.pos.y = window.innerHeight - this.height;
	graphics.beginFill(this.color);
		graphics.lineStyle(4, 0xff3300, 1);
		graphics.drawRect(this.pos.x, this.pos.y, this.width, this.height);
		graphics.endFill();
	}
	update(deltaTime: number) {
		if (this.input.up) this.pos.y -= gameVars.paddleVelocity * deltaTime;
		if (this.input.down) this.pos.y += gameVars.paddleVelocity * deltaTime;
	}
}

interface BallProps {
	pos: vec2;
	radius: number;
	color: number;
	velocity: vec2;
}

class Ball implements BallProps {
	pos: vec2;
	radius: number;
	color: number;
	velocity: vec2;

	constructor(pos: vec2, radius: number, color: number) {
		this.pos = pos;
		this.radius = radius;
		this.color = color;
		this.velocity = createVec2(gameVars.ballVelocityX, gameVars.ballVelocityY);
	}
	getBallCenter() {
		return createVec2(this.pos.x + this.radius, this.pos.y + this.radius);
	}
	getAllEdges() {
		return {
			left: this.pos.x - this.radius,
			right: this.pos.x + this.radius,
			top: this.pos.y - this.radius,
			bottom: this.pos.y + this.radius,
		};
	}
	resetBallToCenter() {
		this.pos.x = window.innerWidth / 2;
		this.pos.y = window.innerHeight / 2;
	}
	draw(graphics: PIXI.Graphics) {
		graphics.lineStyle(4, 0xffffff, 1);
		graphics.beginFill(this.color, 1);
		graphics.drawCircle(this.pos.x, this.pos.y, this.radius);
		graphics.endFill();
	}
	update(deltaTime: number) {
		this.pos.x += this.velocity.x * deltaTime;
		this.pos.y += this.velocity.y * deltaTime;
	}
}

function initGameObjects() {
	const canvasDimensions = createVec2(window.innerWidth, window.innerHeight);
	const canvasCenter = createVec2(
		canvasDimensions.x / 2,
		canvasDimensions.y / 2,
	);
	const leftPaddle = new Paddle(
		createVec2(0, canvasCenter.y - gameVars.paddleHeight / 2),
		gameVars.paddleWidth,
		gameVars.paddleHeight,
		gameVars.paddleColor,
	);
	const rightPaddle = new Paddle(
		createVec2(
			canvasDimensions.x - gameVars.paddleWidth,
			canvasCenter.y - gameVars.paddleHeight / 2,
		),
		gameVars.paddleWidth,
		gameVars.paddleHeight,
		gameVars.paddleColor,
	);
	const ball = new Ball(
		createVec2(canvasCenter.x, canvasCenter.y),
		gameVars.ballRadius,
		gameVars.ballColor,
	);
	return { leftPaddle, rightPaddle, ball };
}

const choosePaddle = (
	ball: Ball,
	leftPaddle: Paddle,
	rightPaddle: Paddle,
): Paddle => {
	return ball.pos.x < window.innerWidth / 2 ? leftPaddle : rightPaddle;
};

const initText = (app: PIXI.Application) => {
	const player1Score = new PIXI.Text('0', {
		fontFamily: 'Arial',
		fontSize: 36,
		fill: 0xffffff,
		align: 'center',
	});
	const player2Score = new PIXI.Text('0', {
		fontFamily: 'Arial',
		fontSize: 36,
		fill: 0xffffff,
		align: 'center',
	});
	player1Score.x = window.innerWidth / 2 - 50;
	player1Score.y = 20;
	player2Score.x = window.innerWidth / 2 + 50;
	player2Score.y = 20;
	app.stage.addChild(player1Score);
	app.stage.addChild(player2Score);
	return { player1Score, player2Score };
};

const Game: React.FC = () => {
	const pixiContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!pixiContainer.current) throw new Error('PixiContainer is not defined');

		const app = new PIXI.Application<HTMLCanvasElement>({
			width: window.innerWidth, // Width of the canvas
			height: window.innerHeight, // Height of the canvas
			backgroundColor: 0x1099bb, // Background color
			// antialias: true, // Anti-aliasing
		});

		pixiContainer.current.appendChild(app.view);

		//! Add your PixiJS application logic here

		// Draw leftPaddle
		const graphics = new PIXI.Graphics();
		const { leftPaddle, rightPaddle, ball } = initGameObjects();
		app.stage.addChild(graphics);
		const { player1Score, player2Score } = initText(app);
		function onWallCollision() {
			// Check if ball is not close to world edges of the screen then return early
			if (ball.pos.y > 100 && ball.pos.y < window.innerHeight - 100) return;
			if (ball.pos.x < 100 && ball.pos.x > window.innerWidth - 100) return;
			// Check if ball is colliding with world's edges
			const allEdges = ball.getAllEdges();
			if (allEdges.top <= 0 || allEdges.bottom > window.innerHeight)
				return (ball.velocity.y *= -1);
			if (allEdges.left <= 0 || allEdges.right > window.innerWidth) {
				// Stop the ball
				ball.resetBallToCenter();
				if (allEdges.left <= 0) {
					gameVars.playerScores.player1 += 1;
					player1Score.text = `${gameVars.playerScores.player1}`;
				} else {
					gameVars.playerScores.player2 += 1;
					player2Score.text = `${gameVars.playerScores.player2}`;
				}
			}
		}

		function ballPaddleCollision(ball: Ball, paddle: Paddle) {
			// If ball is not in the vecinity of the paddle, return
			if (ball.pos.x > 100 && ball.pos.x < window.innerWidth - 100) return;
			// Get the distance between the center of the ball and the paddle
			let dx = Math.abs(ball.pos.x - paddle.getCenter().x) as number;
			let dy = Math.abs(ball.pos.y - paddle.getCenter().y) as number;
			// Distance between edge of the paddle and the center ball
			let compareX = ball.radius + paddle.getHalfWidth();
			let compareY = ball.radius + paddle.getHalfHeight();
			if (dx <= compareX && dy <= compareY) {
				// Collision detected
				ball.velocity.x *= -1;
			}
		}

		document.addEventListener('keydown', (e) => {
			switch (e.key) {
				case 'w':
					leftPaddle.input.up = true;
					break;
				case 's':
					leftPaddle.input.down = true;
					break;
				case 'ArrowUp':
					rightPaddle.input.up = true;
					break;
				case 'ArrowDown':
					rightPaddle.input.down = true;
					break;
			}
		});

		document.addEventListener('keyup', (e) => {
			switch (e.key) {
				case 'w':
					leftPaddle.input.up = false;
					break;
				case 's':
					leftPaddle.input.down = false;
					break;
				case 'ArrowUp':
					rightPaddle.input.up = false;
					break;
				case 'ArrowDown':
					rightPaddle.input.down = false;
					break;
			}
		});

		// Text

		function draw() {
			graphics.clear();
			leftPaddle.draw(graphics);
			rightPaddle.draw(graphics);
			ball.draw(graphics);
		}

		function update(deltaTime: number) {
			// leftPaddle.update(deltaTime);
			// rightPaddle.update(deltaTime);
			// ball.update(deltaTime);
			onWallCollision();
			ballPaddleCollision(ball, choosePaddle(ball, leftPaddle, rightPaddle));
		}

		app.ticker.add((deltaTime) => {
			update(deltaTime);
			draw();
			// console.log(app.ticker.FPS);
		});

		return () => {
			// On component unmount, destroy the application
			if (app) {
				pixiContainer.current?.removeChild(app.view);
				app.destroy();
			}
		};
	}, []);
	return <div ref={pixiContainer} />;
};

export default Game;

