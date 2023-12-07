'use client';
import React from 'react';
import Matter, { Bodies, Render, World } from 'matter-js';
import { useEffect } from 'react';
import { GameEntityFactory } from './GameEntitiesFactory';

const Game = () => {
	useEffect(() => {
		const engine = Matter.Engine.create({ gravity: { y: 0 } });
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
		Render.run(render);

		const factory = new GameEntityFactory();
		World.add(
			engine.world,
			factory.createInitialGameSet({
				width: render.options.width!,
				height: render.options.height!,
			}),
		);

		// Matter.Events.on(engine, 'collisionStart', (event) => {
		// 	let pairs = event.pairs;

		// 	for (let i = 0; i < pairs.length; i++) {
		// 		let pair = pairs[i];
		// 		if (
		// 			(pair.bodyA === ball && pair.bodyB === rightPaddle) ||
		// 			(pair.bodyA === rightPaddle && pair.bodyB === ball)
		// 		) {
		// 			console.log('hit right paddle');
		// 			Matter.Body.setVelocity(ball, { x: -10, y: 10 });
		// 			break;
		// 		}
		// 		if (
		// 			(pair.bodyA === invisibleRightWall && pair.bodyB === ball) ||
		// 			(pair.bodyA === ball && pair.bodyB === invisibleRightWall)
		// 		) {
		// 			console.log('hit right wall');
		// 			Matter.Body.setVelocity(ball, { x: 0, y: 0 });
		// 		}
		// 		if (
		// 			(pair.bodyA === ball && pair.bodyB === leftPaddle) ||
		// 			(pair.bodyA === leftPaddle && pair.bodyB === ball)
		// 		) {
		// 			console.log('hit left paddle');
		// 			Matter.Body.setVelocity(ball, { x: 10, y: 10 });
		// 			break;
		// 		}
		// 		if (
		// 			(pair.bodyA === invisibleLeftWall && pair.bodyB === ball) ||
		// 			(pair.bodyA === ball && pair.bodyB === invisibleLeftWall)
		// 		) {
		// 			console.log('hit left wall');
		// 			Matter.Body.setVelocity(ball, { x: 0, y: 0 });
		// 		}
		// 	}
		// });

		// let moveUp = false as boolean;
		// let moveDown = false as boolean;
		// let moveUpRight = false as boolean;
		// let moveDownRight = false as boolean;

		// const handleKeyDown = (event: KeyboardEvent) => {
		// 	switch (event.key) {
		// 		case 'w':
		// 			moveUp = true;
		// 			break;
		// 		case 's':
		// 			moveDown = true;
		// 			break;
		// 		case 'ArrowUp':
		// 			moveUpRight = true;
		// 			break;
		// 		case 'ArrowDown':
		// 			moveDownRight = true;
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// };

		// const handleKeyUp = (event: KeyboardEvent) => {
		// 	switch (event.key) {
		// 		case 'w':
		// 			moveUp = false;
		// 			Matter.Body.setVelocity(leftPaddle, { x: 0, y: 0 });
		// 			break;
		// 		case 's':
		// 			moveDown = false;
		// 			Matter.Body.setVelocity(leftPaddle, { x: 0, y: 0 });
		// 			break;
		// 		case 'ArrowUp':
		// 			moveUpRight = false;
		// 			Matter.Body.setVelocity(rightPaddle, { x: 0, y: 0 });
		// 			break;
		// 		case 'ArrowDown':
		// 			moveDownRight = false;
		// 			Matter.Body.setVelocity(rightPaddle, { x: 0, y: 0 });
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// };

		// document.addEventListener('keydown', handleKeyDown);
		// document.addEventListener('keyup', handleKeyUp);

		const updateGame = () => {
			Matter.Engine.update(engine, 1000 / 60);
		};

		let frameID: number;
		const gameLoop = () => {
			// if (moveUp) Matter.Body.setVelocity(leftPaddle, { x: 0, y: -10 });
			// if (moveDown) Matter.Body.setVelocity(leftPaddle, { x: 0, y: 10 });
			// if (moveUpRight) Matter.Body.setVelocity(rightPaddle, { x: 0, y: -10 });
			// if (moveDownRight) Matter.Body.setVelocity(rightPaddle, { x: 0, y: 10 });
			updateGame();
			frameID = requestAnimationFrame(gameLoop);
		};

		frameID = requestAnimationFrame(gameLoop);

		return () => {
			cancelAnimationFrame(frameID);
			// document.removeEventListener('keydown', handleKeyDown);
			// document.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	return (
		<div>
			<canvas id="pong-canvas"></canvas>
		</div>
	);
};
export default Game;
