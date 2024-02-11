'use client';
import { useEffect, useRef } from 'react';
import {
	InputType,
	gameFinished,
	mapType,
} from '@/app/gamelobby/GlobalRedux/features';
import { useDispatch, useSelector } from 'react-redux';
import { GameService } from './GameService';
import { RootState } from '@/app/gamelobby/GlobalRedux/store';
import { Direction, GameState } from '@/interfaces';
import { handleKeyDown, handleKeyUp, handleMouseMove } from './interaction';
import { disconnect } from '@/app/gamelobby/GlobalRedux/features';

// Constants
const BACKEND_WIDTH = 600;
const BACKEND_HEIGHT = 400;
const MIN_PADDLE_WIDTH = 8;

function calculateCanvasSize(): { width: number; height: number } {
	let viewportWidth = window.innerWidth / 2; // Adjust if necessary for initial sizing
	let viewportHeight = window.innerHeight / 2; // Adjust if necessary for initial sizing
	let ratio = 3 / 2;
	let width, height;

	if (viewportWidth / viewportHeight >= ratio) {
		// Viewport is wider than needed
		height = viewportHeight;
		width = height * ratio;
	} else {
		// Viewport is taller than needed
		width = viewportWidth;
		height = width / ratio;
	}

	return { width, height };
}

interface scaleProps {
	ball: GameState['ball'];
	paddles: GameState['paddles'];
	frontendWidth: number;
	frontendHeight: number;
}

function scaleGameElementsToFrontend({
	ball,
	paddles,
	frontendWidth,
	frontendHeight,
}: scaleProps) {
	const scaleX = frontendWidth / BACKEND_WIDTH;
	const scaleY = frontendHeight / BACKEND_HEIGHT;

	// Scale positions and sizes of paddles
	const scaledPaddles = {
		player1: {
			position: {
				x: paddles.player1.position.x * scaleX,
				y: paddles.player1.position.y * scaleY,
			},
			size: {
				width: Math.max(paddles.player1.size.width * scaleX, MIN_PADDLE_WIDTH),
				height: paddles.player1.size.height * scaleY,
			},
		},
		player2: {
			position: {
				x: paddles.player2.position.x * scaleX,
				y: paddles.player2.position.y * scaleY,
			},
			size: {
				width: Math.max(paddles.player2.size.width * scaleX, MIN_PADDLE_WIDTH),
				height: paddles.player2.size.height * scaleY,
			},
		},
	};

	// Scale position, radius, and velocity of the ball
	const scaledBall = {
		position: {
			x: ball.position.x * scaleX,
			y: ball.position.y * scaleY,
		},
		radius: ball.radius * Math.min(scaleX, scaleY), // Use the smaller scaling factor to keep the ball's aspect ratio correct
	};

	return { scaledBall, scaledPaddles };
}

export const GameCanvas: React.FC = () => {
	//* Refs
	const canvasRef = useRef<HTMLDivElement>(null);
	const serviceRef = useRef<GameService | null>(null);
	const curDir = useRef<Direction>(Direction.STOPPED);
	//* React Redux
	const gameState = useSelector((state: RootState) => state.game);
	const { inputType, mapChoice } = useSelector(
		(state: RootState) => state.gameConfig,
	);
	const { isGameStarted, isConnected, countDownDone } = useSelector(
		(state: RootState) => state.connection,
	);
	const dispatch = useDispatch();

	useEffect(() => {
		const mouseMoveHandler = (e: MouseEvent) =>
			handleMouseMove(dispatch, e, canvasRef, serviceRef.current);
		const keyDownHandler = (e: KeyboardEvent) =>
			handleKeyDown(dispatch, curDir, e);
		const keyUpHandler = (e: KeyboardEvent) => handleKeyUp(dispatch, curDir, e);

		if (inputType === InputType.MOUSE) {
			canvasRef.current?.addEventListener('mousemove', mouseMoveHandler);
		} else if (inputType === InputType.KEYBOARD) {
			window.addEventListener('keydown', keyDownHandler);
			window.addEventListener('keyup', keyUpHandler);
		}

		return () => {
			if (inputType === InputType.MOUSE) {
				canvasRef.current?.removeEventListener('mousemove', mouseMoveHandler);
			} else if (inputType === InputType.KEYBOARD) {
				window.removeEventListener('keydown', keyDownHandler);
				window.removeEventListener('keyup', keyUpHandler);
			}
		};
	}, [inputType, canvasRef, dispatch]);

	useEffect(() => {
		//* Create the game service if it doesn't exist
		// Log the initial backend coordinates and sizes

		if (!serviceRef.current && canvasRef.current) {
			const { width, height } = calculateCanvasSize();

			// console.log('Creating game service with');
			serviceRef.current = new GameService(
				canvasRef.current as HTMLDivElement,
				width,
				height,
				mapChoice,
			);

			// Ensure to structure the scaleGameElementsToFrontend call correctly based on its expected parameters
			const { scaledBall, scaledPaddles } = scaleGameElementsToFrontend({
				ball: gameState.ball,
				paddles: gameState.paddles,
				frontendWidth: width,
				frontendHeight: height,
			});

			// Now, pass the scaled ball and paddles to the initGameElements function
			serviceRef.current.initGameElements(scaledBall, scaledPaddles);
		}

		//* Update the game service with the current game state
		if (serviceRef.current) {
			const { width, height } = serviceRef.current.getCanvasSize();
			const { scaledBall, scaledPaddles } = scaleGameElementsToFrontend({
				ball: gameState.ball,
				paddles: gameState.paddles,
				frontendWidth: width,
				frontendHeight: height,
			});
			serviceRef.current.updateGameElements(scaledBall, scaledPaddles);
		}

		const handler = () => {
			if (serviceRef.current) {
				const { width, height } = serviceRef.current.resizeHandler();
				// const { scaledBall, scaledPaddles } = scaleGameElementsToFrontend({
				// 	ball: gameState.ball,
				// 	paddles: gameState.paddles,
				// 	frontendWidth: width,
				// 	frontendHeight: height,
				// });
				// serviceRef.current.updateGameElements(scaledBall, scaledPaddles);
			}
		};

		window.addEventListener('resize', handler);

		return () => {
			if (serviceRef.current) window.removeEventListener('resize', handler);
		};

		//? Do I even need to clean up anything because I'm gonna reuse app for other game sessions?
	}, [gameState, mapChoice, isConnected]);

	useEffect(() => {
		const handleBackButton = () => {
			// Custom logic here
			dispatch(disconnect());
			// You can perform actions like redirecting the user here
		};

		window.addEventListener('popstate', handleBackButton);

		return () => {
			window.removeEventListener('popstate', handleBackButton);
		};
	});

	useEffect(() => {
		let timer: NodeJS.Timeout;

		if (isGameStarted && countDownDone) {
			timer = setTimeout(() => {
				// console.log(
				// 	'No game state updates received for 1 second, resetting isGameStarted',
				// );
				dispatch(gameFinished());
			}, 1000); // 1 second
		}

		return () => clearTimeout(timer);
	}, [isGameStarted, countDownDone, gameState]);

	return (
		<div
			className={`z-10 ${
				mapChoice === mapType.STANDARD ? 'px-8 border white rounded-lg' : ''
			}`}
		>
			<div ref={canvasRef} />
		</div>
	);
};
