'use client';
import React, { useEffect, useRef } from 'react';

// interface GameState {
// 	ballX: number;
// 	ballY: number;
// 	ballRadius: number;
// 	ballVelocityX: number;
// 	ballVelocityY: number;
// }

// const gameVars = {
// 	ballX: 200,
// 	ballY: 200,
// 	ballRadius: 30,
// 	ballVelocityX: 2,
// 	ballVelocityY: 2,
// };

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
		// ctx.fill();
		ctx.stroke();
	};
}

const Game = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		console.log(window.innerWidth);
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		if (!ctx) return;
		// Drawing a rectangle
		ctx.fillStyle = 'red';
		ctx.fillRect(100, 100, 50, 50);

		function update() {
			// Update ball position
			gameVars.ballX += gameVars.ballVelocityX;
			gameVars.ballY += gameVars.ballVelocityY;
		}

		function draw() {
			// Drawing a circle
			ctx.beginPath();
			ctx.fillStyle = 'blue';
			ctx.strokeStyle = 'blue';
			ctx.arc(
				gameVars.ballX,
				gameVars.ballY,
				gameVars.ballRadius,
				0,
				2 * Math.PI,
			);
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
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
