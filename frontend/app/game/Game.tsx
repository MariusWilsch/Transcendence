'use client';
import React from 'react';
import Matter, { Bodies, Render } from 'matter-js';
import { useEffect } from 'react';

interface GameEntityFactory {
	createWall(
		x: number,
		y: number,
		width: number,
		height: number,
		options?: object,
	): Matter.Body;
	createBall(
		x: number,
		y: number,
		radius: number,
		options?: object,
	): Matter.Body;
	createPaddle(
		x: number,
		y: number,
		width: number,
		height: number,
		options?: object,
	): Matter.Body;
}

class MatterGameEntityFactory implements GameEntityFactory {
	createWall = (
		x: number,
		y: number,
		width: number,
		height: number,
		options?: object,
	): Matter.Body => Bodies.rectangle(x, y, width, height, options);
	createBall = (
		x: number,
		y: number,
		radius: number,
		options?: object,
	): Matter.Body => Bodies.circle(x, y, radius, options);
	createPaddle = (
		x: number,
		y: number,
		width: number,
		height: number,
		options?: object,
	): Matter.Body => Bodies.rectangle(x, y, width, height, options);
	createInitialGameSet = ({ width, height }: { width: number; height: number }) => {
		const floor = this.createWall(
			width / 2,
			wallThickness / 2,
			width,
			wallThickness,
			wallOptions,
		);
		const ceiling = this.createWall(
			width / 2,
			height - wallThickness / 2,
			width,
			wallThickness,
			wallOptions,
		);
		const leftPaddle = this.createPaddle(
			paddleWidth / 2,
			height / 2,
			paddleWidth,
			paddleHeight,
			paddleOptions,
		);
		const rightPaddle = this.createPaddle(
			width - paddleWidth / 2,
			height / 2,
			paddleWidth,
			paddleHeight,
			paddleOptions,
		);
		const ball = this.createBall(width / 2, height / 2, 20, ballOptions);
		const invisibleRightWall = this.createWall(
			width - paddleWidth + 5, // Slightly behind the paddle
			height / 2,
			1, // Very thin
			height, // Tall enough to cover the movement range
			{ isStatic: true, render: { visible: false } }, // Make it invisible
		);
		const invisibleLeftWall = this.createWall(
			paddleWidth - 5, // Slightly behind the paddle
			height / 2,
			1, // Very thin
			height, // Tall enough to cover the movement range
			{ isStatic: true, render: { visible: false } }, // Make it invisible
		);
		return {
			floor,
			ceiling,
			leftPaddle,
			rightPaddle,
			ball,
			invisibleRightWall,
			invisibleLeftWall,
		};
	};
}

//* Declare hardcoded Constants

const wallOptions = {
	isStatic: true,
	render: {
		fillStyle: 'red',
		strokeStyle: 'red',
	},
};
const paddleOptions = {
	isStatic: false,
	inertia: Infinity,
	render: {
		fillStyle: 'blue',
		strokeStyle: 'blue',
	},
};
const ballOptions = {
	restitution: 1,
	friction: 0,
	render: {
		fillStyle: 'white',
		strokeStyle: 'white',
	},
};

const wallThickness = 20;
const paddleWidth = 20;
const paddleHeight = 100;

const Game = () => {
	useEffect(() => {
		const engine = Matter.Engine.create();
		const render = Render.create({
			element: document.body,
			engine: engine,
			canvas: document.getElementById('pong-canvas') as HTMLCanvasElement,
			options: {
				width: 600,
				height: 400,
				wireframes: false,
			},
		});
		engine.gravity.y = 0;
		Render.run(render);

		const factory = new MatterGameEntityFactory();

		//* Declare variable constants

		const width = render.options.width ? render.options.width : 0;
		const height = render.options.height ? render.options.height : 0;
		const paddleY = height / 2;

		// const floor = Bodies.rectangle(
		// 	width / 2,
		// 	wallThickness / 2,
		// 	width,
		// 	wallThickness,
		// 	wallOptions,
		// );

		const floor = factory.createWall(
			width / 2,
			wallThickness / 2,
			width,
			wallThickness,
			wallOptions,
		);

		// const ceiling = Bodies.rectangle(
		// 	width / 2,
		// 	height - wallThickness / 2,
		// 	width,
		// 	wallThickness,
		// 	wallOptions,
		// );

		const ceiling = factory.createWall(
			width / 2,
			height - wallThickness / 2,
			width,
			wallThickness,
			wallOptions,
		);

		// Create paddles

		// const leftPaddle = Bodies.rectangle(
		// 	paddleWidth / 2,
		// 	paddleY,
		// 	paddleWidth,
		// 	paddleHeight,
		// 	paddleOptions,
		// );

		const leftPaddle = factory.createPaddle(
			paddleWidth / 2,
			paddleY,
			paddleWidth,
			paddleHeight,
			paddleOptions,
		);

		// const rightPaddle = Bodies.rectangle(
		// 	width - paddleWidth / 2,
		// 	paddleY,
		// 	paddleWidth,
		// 	paddleHeight,
		// 	paddleOptions,
		// );

		const rightPaddle = factory.createPaddle(
			width - paddleWidth / 2,
			paddleY,
			paddleWidth,
			paddleHeight,
			paddleOptions,
		);

		rightPaddle.isSensor = true;
		leftPaddle.isSensor = true;

		// const ball = Matter.Bodies.circle(width / 2, height / 2, 20, ballOptions);

		const ball = factory.createBall(width / 2, height / 2, 20, ballOptions);

		// Matter.Body.setVelocity(ball, { x: 5, y: 5 });

		// Detect collisions

		// const invisibleRightWall = Matter.Bodies.rectangle(
		// 	width - paddleWidth + 5, // Slightly behind the paddle
		// 	height / 2,
		// 	1, // Very thin
		// 	height, // Tall enough to cover the movement range
		// 	{ isStatic: true, render: { visible: false } }, // Make it invisible
		// );

		// const invisibleLeftWall = Matter.Bodies.rectangle(
		// 	paddleWidth - 5, // Slightly behind the paddle
		// 	height / 2,
		// 	1, // Very thin
		// 	height, // Tall enough to cover the movement range
		// 	{ isStatic: true, render: { visible: false } }, // Make it invisible
		// );

		const invisibleRightWall = factory.createWall(
			width - paddleWidth + 5, // Slightly behind the paddle
			height / 2,
			1, // Very thin
			height, // Tall enough to cover the movement range
			{ isStatic: true, render: { visible: false } }, // Make it invisible
		);

		const invisibleLeftWall = factory.createWall(
			paddleWidth - 5, // Slightly behind the paddle
			height / 2,
			1, // Very thin
			height, // Tall enough to cover the movement range
			{ isStatic: true, render: { visible: false } }, // Make it invisible
		);

		Matter.World.add(engine.world, [leftPaddle, rightPaddle, ball]);
		Matter.World.add(engine.world, [floor, ceiling]);
		Matter.World.add(engine.world, invisibleRightWall);
		Matter.World.add(engine.world, invisibleLeftWall);

		Matter.Events.on(engine, 'collisionStart', (event) => {
			let pairs = event.pairs;

			for (let i = 0; i < pairs.length; i++) {
				let pair = pairs[i];
				if (
					(pair.bodyA === ball && pair.bodyB === rightPaddle) ||
					(pair.bodyA === rightPaddle && pair.bodyB === ball)
				) {
					console.log('hit right paddle');
					Matter.Body.setVelocity(ball, { x: -10, y: 10 });
					break;
				}
				if (
					(pair.bodyA === invisibleRightWall && pair.bodyB === ball) ||
					(pair.bodyA === ball && pair.bodyB === invisibleRightWall)
				) {
					console.log('hit right wall');
					Matter.Body.setVelocity(ball, { x: 0, y: 0 });
				}
				if (
					(pair.bodyA === ball && pair.bodyB === leftPaddle) ||
					(pair.bodyA === leftPaddle && pair.bodyB === ball)
				) {
					console.log('hit left paddle');
					Matter.Body.setVelocity(ball, { x: 10, y: 10 });
					break;
				}
				if (
					(pair.bodyA === invisibleLeftWall && pair.bodyB === ball) ||
					(pair.bodyA === ball && pair.bodyB === invisibleLeftWall)
				) {
					console.log('hit left wall');
					Matter.Body.setVelocity(ball, { x: 0, y: 0 });
				}
			}
		});

		Matter.Render.lookAt(render, {
			min: { x: 0, y: 0 },
			max: { x: width, y: height },
		});

		let moveUp = false as boolean;
		let moveDown = false as boolean;
		let moveUpRight = false as boolean;
		let moveDownRight = false as boolean;

		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'w':
					moveUp = true;
					break;
				case 's':
					moveDown = true;
					break;
				case 'ArrowUp':
					moveUpRight = true;
					break;
				case 'ArrowDown':
					moveDownRight = true;
					break;
				default:
					break;
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'w':
					moveUp = false;
					Matter.Body.setVelocity(leftPaddle, { x: 0, y: 0 });
					break;
				case 's':
					moveDown = false;
					Matter.Body.setVelocity(leftPaddle, { x: 0, y: 0 });
					break;
				case 'ArrowUp':
					moveUpRight = false;
					Matter.Body.setVelocity(rightPaddle, { x: 0, y: 0 });
					break;
				case 'ArrowDown':
					moveDownRight = false;
					Matter.Body.setVelocity(rightPaddle, { x: 0, y: 0 });
					break;
				default:
					break;
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		const updateGame = () => {
			Matter.Engine.update(engine, 1000 / 60);
		};

		let frameID: number;
		const gameLoop = () => {
			if (moveUp) Matter.Body.setVelocity(leftPaddle, { x: 0, y: -10 });
			if (moveDown) Matter.Body.setVelocity(leftPaddle, { x: 0, y: 10 });
			if (moveUpRight) Matter.Body.setVelocity(rightPaddle, { x: 0, y: -10 });
			if (moveDownRight) Matter.Body.setVelocity(rightPaddle, { x: 0, y: 10 });
			updateGame();
			frameID = requestAnimationFrame(gameLoop);
		};

		frameID = requestAnimationFrame(gameLoop);

		return () => {
			cancelAnimationFrame(frameID);
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	return (
		<div>
			<canvas id="pong-canvas"></canvas>
		</div>
	);
};
export default Game;
