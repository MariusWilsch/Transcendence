'use client';
import React, { useEffect, useRef } from 'react';

let upPressed = false as boolean;
let downPressed = false as boolean;
let deltaTime = 0 as number;

const gameVars = {
	ballX: 200,
	ballY: 200,
	ballRadius: 30,
	ballVelocityX: 5,
	ballVelocityY: 5,
	// Paddle Config
	paddleWidth: 20,
	paddleHeight: 100,
	paddleVelocityX: 1,
	paddleVelocityY: 1,
};

interface vec2 {
	x: number;
	y: number;
}

interface BallState {
	pos: vec2;
	velocity: vec2;
	radius: number;
}

const vec2 = (x: number, y: number) => ({ x: x, y: y });

// ES6 class
class Ball implements BallState {
	pos: vec2;
	velocity: vec2;
	radius: number;
	constructor(pos: vec2, velocity: vec2, radius: number) {
		this.pos = pos;
		this.velocity = velocity;
		this.radius = radius;
	}

	update = function (this: Ball) {
		// console.log(this.pos);
		this.pos.x += this.velocity.x;
		this.pos.y += this.velocity.y;
	};

	draw = function (this: Ball, ctx: CanvasRenderingContext2D) {
		// Clearing the ball
		// const diameter = this.radius * 2; //! May increase performance when only clearing the ball instead of the whole canvas
		// ctx.clearRect(
		// 	this.pos.x - this.radius,
		// 	this.pos.y - this.radius,
		// 	diameter,
		// 	diameter,
		// );
		ctx.fillStyle = '#E2E8F0';
		ctx.strokeStyle = '#E2E8F0';
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = 'lightblue';
		ctx.fill();
		ctx.stroke();
	};
}

interface PaddleState {
	pos: vec2;
	velocity: vec2;
	width: number;
	height: number;
}

class Paddle implements PaddleState {
	pos: vec2;
	velocity: vec2;
	width: number;
	height: number;
	constructor(pos: vec2, velocity: vec2, width: number, height: number) {
		this.pos = pos;
		this.velocity = velocity;
		this.width = width;
		this.height = height;
	}
	update = function (this: Paddle) {
		if (upPressed) {
			this.pos.y -= this.velocity.y * deltaTime;
		} else if (downPressed) this.pos.y += this.velocity.y * deltaTime;
	};
	draw = function (this: Paddle, ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = '#E2E8F0';
		ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
	};
	getHalfWidth = function (this: Paddle) {
		return this.width / 2;
	};
	getHalfHeight = function (this: Paddle) {
		return this.height / 2;
	};
	getCenter = function (this: Paddle) {
		return vec2(
			this.pos.x + this.getHalfWidth(),
			this.pos.y + this.getHalfHeight(),
		);
	};
}

const Game = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		// log screen size
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		if (!ctx) return;
		// Drawing a rectangle

		window.addEventListener('keydown', (e) => {
			if (e.key == 'ArrowUp') upPressed = true;
			else if (e.key == 'ArrowDown') downPressed = true;
		});

		window.addEventListener('keyup', (e) => {
			if (e.key === 'ArrowUp') {
				upPressed = false;
			} else if (e.key === 'ArrowDown') {
				downPressed = false;
			}
		});

		const leftPaddle: Paddle = new Paddle(
			vec2(0, canvas.height / 2 - gameVars.paddleHeight / 2),
			vec2(gameVars.paddleVelocityX, gameVars.paddleVelocityY),
			gameVars.paddleWidth,
			gameVars.paddleHeight,
		);
		const rightPaddle: Paddle = new Paddle(
			vec2(
				canvas.width - gameVars.paddleWidth,
				canvas.height / 2 - gameVars.paddleHeight / 2,
			),
			vec2(gameVars.paddleVelocityX, gameVars.paddleVelocityY),
			gameVars.paddleWidth,
			gameVars.paddleHeight,
		);
		const ball: Ball = new Ball(
			vec2(gameVars.ballX, gameVars.ballY),
			vec2(gameVars.ballVelocityX, gameVars.ballVelocityY),
			gameVars.ballRadius,
		);

		console.log(ball.pos);

		function paddleCollisionWithEdges(Paddle: Paddle) {
			if (!canvas) return;
			// Paddle collision with bottom edge
			if (Paddle.pos.y + Paddle.height >= canvas.height)
				Paddle.pos.y = canvas.height - Paddle.height;
			// Paddle collision with top edge
			if (Paddle.pos.y <= 0) Paddle.pos.y = 0;
		}

		function ballCollisionWithEdges(Ball: Ball) {
			//* Refactor this
			if (!canvas) return;
			// Ball collision with bottom edge
			if (Ball.pos.y + Ball.radius >= canvas.height) Ball.velocity.y *= -1;
			// Ball collision with top edge
			if (Ball.pos.y - Ball.radius <= 0) Ball.velocity.y *= -1;
			// Ball collision with right edge
			if (Ball.pos.x + Ball.radius >= canvas.width) Ball.velocity.x *= -1;
			// Ball collision with left edge
			if (Ball.pos.x - Ball.radius <= 0) Ball.velocity.x *= -1;
		}

		function ballPaddleCollision(ball: Ball, paddle: Paddle) {
			// Get the distance between the ball and the paddle
			let dx = Math.abs(ball.pos.x - paddle.getCenter().x) as number;
			let dy = Math.abs(ball.pos.y - paddle.getCenter().y) as number;

			let compareX = dx - paddle.getHalfWidth();
			let compareY = dy - paddle.getHalfHeight();

			if (dx <= compareX && dy <= compareY) {
				// Collision detected
				ball.velocity.x *= -1;
			}
		}

		function update() {
			// Update ball position
			ball.update();
			// Update paddle position
			leftPaddle.update();
			// rightPaddle.update();
			// Check for ball collision with edges
			ballCollisionWithEdges(ball);
			// Check for paddle collision with edges
			paddleCollisionWithEdges(leftPaddle);
			// Check for ball collision with paddle
			ballPaddleCollision(ball, leftPaddle);
			ballPaddleCollision(ball, rightPaddle);
		}

		function draw() {
			// Drawing a circle
			ball.draw(ctx);
			// Drawing a paddles
			leftPaddle.draw(ctx);
			rightPaddle.draw(ctx);
		}

		let lastTime = 0;
		function loop() {
			const currentTime = Date.now();
			deltaTime = currentTime - lastTime;
			lastTime = currentTime;
			// const fps = 1000 / deltaTime;
			// console.log(`FPS: ${fps.toFixed(2)}`);
			if (!canvas) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height); //! Clear canvas, what if we just clear the ball and paddles?
			window.requestAnimationFrame(loop); // Request next frame
			update(); // Update game variables
			draw(); // Draw next frame
		}
		loop();
	}, []);

	return <canvas ref={canvasRef} className="bg-indigo-800"></canvas>;
};

export default Game;
