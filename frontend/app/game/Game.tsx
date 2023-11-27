import React from 'react';
import Matter, { Bodies } from 'matter-js';
import { useEffect } from 'react';

const Game = () => {
	useEffect(() => {
		const engine = Matter.Engine.create();
		const render = Matter.Render.create({
			element: document.body,
			engine: engine,
			canvas: document.getElementById('pong-canvas') as HTMLCanvasElement,
			options: {
				width: 600,
				height: 400,
				wireframes: false,
			},
		});

		// Declare constants
		const wallThickness = 20;
		const width = render.options.width ? render.options.width : 0;
		const height = render.options.height ? render.options.height : 0;

		// Top and bottom walls
		const wallOptions = {
			isStatic: true,
			render: {
				fillStyle: 'red',
				strokeStyle: 'red',
			},
		};

		const floor = Matter.Bodies.rectangle(
			width / 2,
			wallThickness / 2,
			width,
			wallThickness,
			wallOptions,
		);
		const ceiling = Matter.Bodies.rectangle(
			width / 2,
			height - wallThickness / 2,
			width,
			wallThickness,
			wallOptions,
		);
		Matter.World.add(engine.world, [floor, ceiling]);

		Matter.Render.lookAt(render, {
			min: { x: 0, y: 0 },
			max: { x: width, y: height },
		});

		// Create paddles

		const paddleWidth = 20;
		const paddleHeight = 100;
		const paddleX = 20;
		const paddleY = height / 2;
		const paddleOptions = {
			isStatic: true,
			render: {
				fillStyle: 'blue',
				strokeStyle: 'blue',
			},
		};
		const ballOptions = {
			restitution: 1,
			render: {
				fillStyle: 'white',
				strokeStyle: 'white',
			},
		};

		const leftPaddle = Matter.Bodies.rectangle(
			paddleWidth / 2,
			paddleY,
			paddleWidth,
			paddleHeight,
			paddleOptions,
		);

		const rightPaddle = Matter.Bodies.rectangle(
			width - paddleWidth / 2,
			paddleY,
			paddleWidth,
			paddleHeight,
			paddleOptions,
		);

		const ball = Matter.Bodies.circle(width / 2, height / 2, 20, ballOptions);

		Matter.World.add(engine.world, [leftPaddle, rightPaddle, ball]);

		Matter.Render.run(render);
		const runner = Matter.Runner.create();
		Matter.Runner.run(runner, engine);
	}, []);

	return (
		<div>
			<canvas id="pong-canvas"></canvas>
		</div>
	);
};
export default Game;
