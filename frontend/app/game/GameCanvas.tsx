//! Needs refactoring

// 'use client';
// import { useEffect, useRef } from 'react';
// import { movePaddle } from '@/app/GlobalRedux/features';
// import { useDispatch, useSelector } from 'react-redux';
// import { GameService } from './GameService';
// import { RootState } from '@/app/GlobalRedux/store';
// import { Direction } from '@/interfaces';

// export const GameCanvas: React.FC = () => {
// 	const canvasRef = useRef<HTMLDivElement>(null);
// 	const serviceRef = useRef<GameService | null>(null);
// 	const dispatch = useDispatch();
// 	const gameState = useSelector((state: RootState) => state.game);

// 	//* Paddle movement event listeners

// 	const currentDirection = useRef<Direction>(Direction.STOPPED);

// 	useEffect(() => {
// 		const handleKeyDown = (e: KeyboardEvent) => {
// 			let newDirection: Direction; // Define newDirection inside the handler

// 			switch (e.key) {
// 				case 'w':
// 					newDirection = Direction.UP;
// 					break;
// 				case 's':
// 					newDirection = Direction.DOWN;
// 					break;
// 				default:
// 					return; // Early return if the key is not relevant
// 			}

// 			// Dispatch and update direction only if it has changed
// 			if (newDirection !== currentDirection.current) {
// 				dispatch(movePaddle({ direction: newDirection }));
// 				currentDirection.current = newDirection;
// 			}
// 		};

// 		const handleKeyUp = (e: KeyboardEvent) => {
// 			if (
// 				(e.key === 'w' && currentDirection.current === Direction.UP) ||
// 				(e.key === 's' && currentDirection.current === Direction.DOWN)
// 			) {
// 				const newDirection = Direction.STOPPED;
// 				dispatch(movePaddle({ direction: newDirection }));
// 				currentDirection.current = newDirection;
// 			}
// 		};

// 		window.addEventListener('keydown', handleKeyDown);
// 		window.addEventListener('keyup', handleKeyUp);

// 		return () => {
// 			window.removeEventListener('keydown', handleKeyDown);
// 			window.removeEventListener('keyup', handleKeyUp);
// 		};
// 	}, [dispatch]);

// 	//* Mouse movement event listeners
// 	//! put these somewhere else where it's sensible to put them

// 	const lastTime = useRef<number>(0);
// 	const lastPos = useRef<number | null>(null);
// 	//? Not sure if we need that because we will dispatch the action on mouse move
// 	const mouseDirection = useRef<Direction>(Direction.STOPPED);

// 	useEffect(() => {
// 		const handleMouseMove = (e: MouseEvent) => {
// 			const currentPos = e.clientY;

// 			if (lastPos.current === null) {
// 				lastPos.current = currentPos;
// 				lastTime.current = Date.now();
// 				return;
// 			}

// 			const currentTime = Date.now();

// 			const timeDiff = currentTime - lastTime.current;
// 			const distanceDiff = currentPos - lastPos.current;

// 			// Calculate the velocity (distance moved / by time taken)
// 			// If no time has passed, set velocity to 0 to avoid division by zero
// 			const velocity = timeDiff > 0 ? distanceDiff / timeDiff : 0;

// 			// If the mouse is moving up, move the paddle up
// 			// If the mouse is moving down, move the paddle down
// 			// If the mouse is stopped, stop the paddle
// 			let newDirection: Direction = Direction.STOPPED;
// 			if (velocity < -0.02) newDirection = Direction.UP;
// 			else if (velocity > 0.02) newDirection = Direction.DOWN;
// 			else if (Math.abs(velocity) < 0.02) newDirection = Direction.STOPPED;

// 			if (newDirection !== mouseDirection.current) {
// 				//Update the current direction
// 				mouseDirection.current = newDirection;
// 				// dispatch(movePaddle({ direction: newDirection, player: 'player1' }));
// 				console.log('Mouse direction changed to', newDirection);
// 			}

// 			lastTime.current = currentTime;
// 			lastPos.current = currentPos;
// 		};
// 		canvasRef.current?.addEventListener('mousemove', handleMouseMove);

// 		return () => {
// 			canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
// 		};
// 	}, [canvasRef]);

// 	useEffect(() => {
// 		//* Create the game service if it doesn't exist
// 		//! I think I need to check If the user is actually in a game session ot
// 		if (!serviceRef.current) {
// 			console.log('Creating game service with', gameState);
// 			serviceRef.current = new GameService(
// 				canvasRef.current as HTMLDivElement,
// 				gameState.canvasWidth,
// 				gameState.canvasHeight,
// 			);
// 			serviceRef.current.initGameElements(gameState.ball, gameState.paddles);
// 		}

// 		//* Update the game service with the current game state
// 		if (serviceRef.current) {
// 			serviceRef.current.updateGameElements(gameState);
// 		}

// 		//* Cleanup on unmount
// 		//? Do I even need to clean up anything because I'm gonna reuse app for other game sessions?
// 		// return () => {
// 		// 	console.log('Cleaning up game canvas');
// 		// 	if (serviceRef.current) {
// 		// 		serviceRef.current.clearGameElements();
// 		// 		serviceRef.current = null;
// 		// 	}
// 		// };
// 	}, [gameState]);

// 	return (
// 		<div className="border white rounded-lg px-8">
// 			<div ref={canvasRef} />
// 		</div>
// 	);
// };

//! begun refactored version below

'use client';
import { useEffect, useRef } from 'react';
import { movePaddle, mouseOrKeyboard } from '@/app/GlobalRedux/features';
import { useDispatch, useSelector } from 'react-redux';
import { GameService } from './GameService';
import { RootState } from '@/app/GlobalRedux/store';
import { Direction } from '@/interfaces';
import { handleKeyDown, handleKeyUp, handleMouseMove } from './interaction';

export const GameCanvas: React.FC = () => {
	//* Refs
	const canvasRef = useRef<HTMLDivElement>(null);
	const serviceRef = useRef<GameService | null>(null);
	const curDir = useRef<Direction>(Direction.STOPPED);
	//* React Redux
	const gameState = useSelector((state: RootState) => state.game);
	const inputChoice = useSelector(
		(state: RootState) => state.gameConfig.mouseOrKeyboard,
	);
	const dispatch = useDispatch();

	useEffect(() => {
		const mouseMoveHandler = (e: MouseEvent) =>
			handleMouseMove(dispatch, e, canvasRef);
		const keyDownHandler = (e: KeyboardEvent) =>
			handleKeyDown(dispatch, curDir, e);
		const keyUpHandler = (e: KeyboardEvent) => handleKeyUp(dispatch, curDir, e);

		if (inputChoice === mouseOrKeyboard.MOUSE) {
			canvasRef.current?.addEventListener('mousemove', mouseMoveHandler);
		} else if (inputChoice === mouseOrKeyboard.KEYBOARD) {
			window.addEventListener('keydown', keyDownHandler);
			window.addEventListener('keyup', keyUpHandler);
		}

		return () => {
			if (inputChoice === mouseOrKeyboard.MOUSE) {
				canvasRef.current?.removeEventListener('mousemove', mouseMoveHandler);
			} else if (inputChoice === mouseOrKeyboard.KEYBOARD) {
				window.removeEventListener('keydown', keyDownHandler);
				window.removeEventListener('keyup', keyUpHandler);
			}
		};
	}, [inputChoice, curDir, canvasRef, dispatch]);

	//* Paddle movement event listeners

	useEffect(() => {
		//* Create the game service if it doesn't exist
		//! I think I need to check If the user is actually in a game session ot
		if (!serviceRef.current) {
			console.log('Creating game service with', gameState);
			serviceRef.current = new GameService(
				canvasRef.current as HTMLDivElement,
				gameState.canvasWidth,
				gameState.canvasHeight,
			);
			serviceRef.current.initGameElements(gameState.ball, gameState.paddles);
		}

		//* Update the game service with the current game state
		if (serviceRef.current) {
			serviceRef.current.updateGameElements(gameState);
		}

		//* Cleanup on unmount
		//? Do I even need to clean up anything because I'm gonna reuse app for other game sessions?
		// return () => {
		// 	console.log('Cleaning up game canvas');
		// 	if (serviceRef.current) {
		// 		serviceRef.current.clearGameElements();
		// 		serviceRef.current = null;
		// 	}
		// };
	}, [gameState]);

	return (
		<div className="border white rounded-lg px-8">
			<div ref={canvasRef} />
		</div>
	);
};
