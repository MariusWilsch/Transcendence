'use client';
import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

interface gameVars {
	backgroundColor: number;
	paddleWidth: number;
	paddleHeight: number;
	paddleColor: number;
	paddleVelocity: number;
	ballColor: number;
	ballRadius: number;
	ballVelocityX: number;
	ballVelocityY: number;
}

const gameVars = {
	// backgroundColor: 0x1099bb,
	paddleWidth: 20,
	paddleHeight: 100,
	paddleColor: 0xde3249,
	paddleVelocity: 5,
	ballColor: 0xffffff,
	ballRadius: 20,
	ballVelocityX: 0,
	ballVelocityY: 2,
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
	draw(graphics: PIXI.Graphics) {
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
	draw(graphics: PIXI.Graphics) {
		graphics.beginFill(this.color);
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

const Game: React.FC = () => {
	const pixiContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!pixiContainer.current) throw new Error('PixiContainer is not defined');

		const app = new PIXI.Application<HTMLCanvasElement>({
			width: window.innerWidth, // Width of the canvas
			height: window.innerHeight, // Height of the canvas
			backgroundColor: 0x1099bb, // Background color
		});

		pixiContainer.current.appendChild(app.view);

		// Add your PixiJS application logic here

		// Draw leftPaddle
		const graphics = new PIXI.Graphics();
		const { leftPaddle, rightPaddle, ball } = initGameObjects();
		app.stage.addChild(graphics);

		function onWallCollision() {
			if (
				ball.getBallCenter().y <= 0 ||
				ball.getBallCenter().y >= window.innerHeight
			)
				ball.velocity.y *= -1;
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

		function draw() {
			graphics.clear();
			leftPaddle.draw(graphics);
			rightPaddle.draw(graphics);
			ball.draw(graphics);
		}

		function update(deltaTime: number) {
			leftPaddle.update(deltaTime);
			rightPaddle.update(deltaTime);
			ball.update(deltaTime);
			onWallCollision();
		}

		app.ticker.add((deltaTime) => {
			update(deltaTime);
			draw();
			console.log(app.ticker.FPS);
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
