'use client';
import { useEffect, useRef } from 'react';
import { movePaddle } from '@/app/GlobalRedux/features';
import { useDispatch, useSelector } from 'react-redux';
import { GameService } from './GameService';
import { RootState } from '@/app/GlobalRedux/store';

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

	useEffect(() => {
		//* Create the game service if it doesn't exist
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

//! Move to the right location later
