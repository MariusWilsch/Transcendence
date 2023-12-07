import { Bodies } from 'matter-js';

//! Continue refactoring this when I figured out if I keep using hard-coded values or not
//* Right now it works but it I have the "feeling" that I can reduce the amount of hard-coded values and lines of code

const wallOptions = {
	isStatic: true,
	render: {
		fillStyle: 'red',
		strokeStyle: 'red',
	},
};
const paddleOptions = {
	isSensor: true,
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

interface GameEntity {
	// createWall(
	// 	x: number,
	// 	y: number,
	// 	width: number,
	// 	height: number,
	// 	options?: object,
	// ): Matter.Body;
	// createBall(
	// 	x: number,
	// 	y: number,
	// 	radius: number,
	// 	options?: object,
	// ): Matter.Body;
	// createPaddle(
	// 	x: number,
	// 	y: number,
	// 	width: number,
	// 	height: number,
	// 	options?: object,
	// ): Matter.Body;
	createInitialGameSet({
		width,
		height,
	}: {
		width: number;
		height: number;
	}): Matter.Body[];
}

interface InitialGameEntity {}

export class GameEntityFactory implements GameEntity {
	// createWall = (
	// 	x: number,
	// 	y: number,
	// 	width: number,
	// 	height: number,
	// 	options?: object,
	// ): Matter.Body => Bodies.rectangle(x, y, width, height, options);
	// createBall = (
	// 	x: number,
	// 	y: number,
	// 	radius: number,
	// 	options?: object,
	// ): Matter.Body => Bodies.circle(x, y, radius, options);
	// createPaddle = (
	// 	x: number,
	// 	y: number,
	// 	width: number,
	// 	height: number,
	// 	options?: object,
	// ): Matter.Body => Bodies.rectangle(x, y, width, height, options);
	createInitialGameSet = ({
		width,
		height,
	}: {
		width: number;
		height: number;
	}) => {
		return [
			Bodies.rectangle(
				width / 2,
				wallThickness / 2,
				width,
				wallThickness,
				wallOptions,
			),
			Bodies.rectangle(
				width / 2,
				height - wallThickness / 2,
				width,
				wallThickness,
				wallOptions,
			),
			Bodies.rectangle(
				paddleWidth / 2,
				height / 2,
				paddleWidth,
				paddleHeight,
				paddleOptions,
			),
			Bodies.rectangle(
				width - paddleWidth / 2,
				height / 2,
				paddleWidth,
				paddleHeight,
				paddleOptions,
			),
			Bodies.circle(width / 2, height / 2, 20, ballOptions),
			Bodies.rectangle(width - paddleWidth + 5, height / 2, 1, height, {
				isStatic: true,
				render: { visible: false },
			}),
			Bodies.rectangle(paddleWidth - 5, height / 2, 1, height, {
				isStatic: true,
				render: { visible: false },
			}),
		];
		// createInitialGameSet = ({
		// 	width,
		// 	height,
		// }: {
		// 	width: number;
		// 	height: number;
		// }) => {
		// 	return [
		// 		this.createWall(
		// 			width / 2,
		// 			wallThickness / 2,
		// 			width,
		// 			wallThickness,
		// 			wallOptions,
		// 		),
		// 		this.createWall(
		// 			width / 2,
		// 			height - wallThickness / 2,
		// 			width,
		// 			wallThickness,
		// 			wallOptions,
		// 		),
		// 		this.createPaddle(
		// 			paddleWidth / 2,
		// 			height / 2,
		// 			paddleWidth,
		// 			paddleHeight,
		// 			paddleOptions,
		// 		),
		// 		this.createPaddle(
		// 			width - paddleWidth / 2,
		// 			height / 2,
		// 			paddleWidth,
		// 			paddleHeight,
		// 			paddleOptions,
		// 		),
		// 		this.createBall(width / 2, height / 2, 20, ballOptions),
		// 		this.createWall(
		// 			width - paddleWidth + 5, // Slightly behind the paddle
		// 			height / 2,
		// 			1, // Very thin
		// 			height, // Tall enough to cover the movement range
		// 			{ isStatic: true, render: { visible: false } }, // Make it invisible
		// 		),
		// 		this.createWall(
		// 			paddleWidth - 5, // Slightly behind the paddle
		// 			height / 2,
		// 			1, // Very thin
		// 			height, // Tall enough to cover the movement range
		// 			{ isStatic: true, render: { visible: false } }, // Make it invisible
		// 		),
		// 	];
	};
}
