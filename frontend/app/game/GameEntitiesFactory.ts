import { Bodies } from 'matter-js';
const { rectangle, circle } = Bodies;

//! Continue refactoring this when I figured out if I keep using hard-coded values or not
//* Right now it works but it I have the "feeling" that I can reduce the amount of hard-coded values and lines of code

//* Potential Improvements:
// Configuration Options: If you foresee the need to further customize the game entities in the future (e.g., different colors, sizes, or physical properties), consider enhancing your factory method to accept additional configuration options. This can be achieved by passing an additional configuration object or individual parameters to customize each entity.
// Refactoring Hardcoded Values: You mentioned the concern about hardcoded values. It's a valid consideration, especially if these values might change or if you want to allow for different configurations in the future. You could pass these as parameters or have configuration objects that define these properties, which would then be passed to the factory method.
// Naming Convention: The naming of createInitialGameSet clearly indicates its purpose. If you plan to have different sets for different game modes or configurations, consider naming them accordingly (e.g., createStandardGameSet, createAdvancedGameSet, etc.).

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
	createInitialGameSet({
		width,
		height,
	}: {
		width: number;
		height: number;
	}): Matter.Body[];
}

export class GameEntityFactory implements GameEntity {
	createInitialGameSet = ({
		width,
		height,
	}: {
		width: number;
		height: number;
	}) => {
		return [
			rectangle(
				width / 2,
				wallThickness / 2,
				width,
				wallThickness,
				wallOptions,
			),
			rectangle(
				width / 2,
				height - wallThickness / 2,
				width,
				wallThickness,
				wallOptions,
			),
			rectangle(
				paddleWidth / 2,
				height / 2,
				paddleWidth,
				paddleHeight,
				paddleOptions,
			),
			rectangle(
				width - paddleWidth / 2,
				height / 2,
				paddleWidth,
				paddleHeight,
				paddleOptions,
			),
			circle(width / 2, height / 2, 20, ballOptions),
			rectangle(width - paddleWidth + 5, height / 2, 1, height, {
				isStatic: true,
				render: { visible: false },
			}),
			rectangle(paddleWidth - 5, height / 2, 1, height, {
				isStatic: true,
				render: { visible: false },
			}),
		];
	};
}
