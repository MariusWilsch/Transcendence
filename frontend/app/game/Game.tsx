'use client';
import React, { useEffect, useRef } from 'react';

interface GameState {
	ballX: number;
	ballY: number;
	ballRadius: number;
	ballVelocityX: number;
	ballVelocityY: number;
}

const gameVars = {
	ballX: 200,
	ballY: 200,
	ballRadius: 30,
	ballVelocityX: 5,
	ballVelocityY: 5,
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
		this.pos.x += this.velocity.x;
		this.pos.y += this.velocity.y;
	};

	draw = function (this: Ball, ctx: CanvasRenderingContext2D) {
		ctx.beginPath();
		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = 'lightblue';
		ctx.fill();
		ctx.stroke();
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
		ctx.fillStyle = 'red';
		ctx.fillRect(100, 100, 50, 50);

		const ball: Ball = new Ball(
			vec2(gameVars.ballX, gameVars.ballY),
			vec2(gameVars.ballVelocityX, gameVars.ballVelocityY),
			gameVars.ballRadius,
		);

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

		function update() {
			// Update ball position
			ball.update();
			ballCollisionWithEdges(ball);
		}

		function draw() {
			// Drawing a circle
			ball.draw(ctx);
		}

		function loop() {
			if (!canvas) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height); //! Clear canvas
			window.requestAnimationFrame(loop); // Request next frame
			update(); // Update game variables
			draw(); // Draw next frame
		}
		loop();
	}, []);

	return <canvas ref={canvasRef}></canvas>;
};

export default Game;
