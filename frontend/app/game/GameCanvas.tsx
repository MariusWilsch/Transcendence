'use client';
import { useEffect, useRef } from 'react';
import { movePaddle } from '@/app/GlobalRedux/features';
import { useDispatch, useSelector } from 'react-redux';
import { GameService } from './GameService';
import { RootState } from '@/app/GlobalRedux/store';
import { Mouse } from 'matter-js';

export const GameCanvas: React.FC = () => {
	const canvasRef = useRef<HTMLDivElement>(null);
	const serviceRef = useRef<GameService | null>(null);
	const dispatch = useDispatch();
	const gameState = useSelector((state: RootState) => state.game);

	//* Paddle movement event listeners
	useEffect(() => {
		// Move paddle when key is pressed
		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'w':
					dispatch(movePaddle({ direction: 'up', player: 'player1' }));
					break;
				case 's':
					dispatch(movePaddle({ direction: 'down', player: 'player1' }));
					break;
				case 'ArrowUp':
					dispatch(movePaddle({ direction: 'up', player: 'player2' }));
					break;
				case 'ArrowDown':
					dispatch(movePaddle({ direction: 'down', player: 'player2' }));
					break;
				default:
					break;
			}
		};

		// Stop paddle movement when key is released
		const handleKeyUp = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'w':
					dispatch(movePaddle({ direction: 'stop', player: 'player1' }));
					break;
				case 's':
					dispatch(movePaddle({ direction: 'stop', player: 'player1' }));
					break;
				case 'ArrowUp':
					dispatch(movePaddle({ direction: 'stop', player: 'player2' }));
					break;
				case 'ArrowDown':
					dispatch(movePaddle({ direction: 'stop', player: 'player2' }));
					break;
				default:
					break;
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [dispatch]);

	//* Mouse movement event listeners
	//! put these somewhere else where it's sensible to put them
	enum MouseDirection {
		UP,
		DOWN,
		STOPPED,
	}

	const lastTime = useRef<number>(0);
	const lastPos = useRef<number | null>(null);
	//? Not sure if we need that because we will dispatch the action on mouse move
	const mouseDirection = useRef<MouseDirection>(MouseDirection.STOPPED);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const currentPos = e.clientY;

			if (lastPos.current === null) {
				lastPos.current = currentPos;
				lastTime.current = Date.now();
				return;
			}

			const currentTime = Date.now();

			const timeDiff = currentTime - lastTime.current;
			const distanceDiff = currentPos - lastPos.current;

			// Calculate the velocity (distance moved / by time taken)
			// If no time has passed, set velocity to 0 to avoid division by zero
			const velocity = timeDiff > 0 ? distanceDiff / timeDiff : 0;

			// If the mouse is moving up, move the paddle up
			// If the mouse is moving down, move the paddle down
			// If the mouse is stopped, stop the paddle
			let newDirection: MouseDirection = MouseDirection.STOPPED;
			if (velocity < -0.02) newDirection = MouseDirection.UP;
			else if (velocity > 0.02) newDirection = MouseDirection.DOWN;
			else if (Math.abs(velocity) < 0.02) newDirection = MouseDirection.STOPPED;

			if (newDirection !== mouseDirection.current) {
				//Update the current direction
				mouseDirection.current = newDirection;
				// dispatch(movePaddle({ direction: newDirection, player: 'player1' }));
				console.log('Mouse direction changed to', newDirection);
			}

			lastTime.current = currentTime;
			lastPos.current = currentPos;
		};
		canvasRef.current?.addEventListener('mousemove', handleMouseMove);

		return () => {
			canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
		};
	}, [canvasRef]);

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
