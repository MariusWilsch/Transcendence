'use client';
import { useEffect, useRef } from 'react';
import { InputType, mapType } from '@/app/gamelobby/GlobalRedux/features';
import { useDispatch, useSelector } from 'react-redux';
import { GameService } from './GameService';
import { RootState } from '@/app/gamelobby/GlobalRedux/store';
import { Direction } from '@/interfaces';
import { handleKeyDown, handleKeyUp, handleMouseMove } from './interaction';
import { disconnect } from '@/app/gamelobby/GlobalRedux/features';

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
	const { isGameStarted, isConnected } = useSelector(
		(state: RootState) => state.connection,
	);
	const dispatch = useDispatch();

	useEffect(() => {
		const mouseMoveHandler = (e: MouseEvent) =>
			handleMouseMove(dispatch, e, canvasRef);
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

	//* Paddle movement event listeners

	useEffect(() => {
		//* Create the game service if it doesn't exist
		if (!serviceRef.current) {
			console.log('Creating game service with', gameState);

			serviceRef.current = new GameService(
				canvasRef.current as HTMLDivElement,
				gameState.canvasWidth,
				gameState.canvasHeight,
				mapChoice,
			);
			serviceRef.current.initGameElements(gameState.ball, gameState.paddles);
		}

		//* Update the game service with the current game state
		if (serviceRef.current) {
			serviceRef.current.updateGameElements(gameState);
		}

		//? Do I even need to clean up anything because I'm gonna reuse app for other game sessions?
	}, [gameState, mapChoice, isConnected]);

	useEffect(() => {
		const handleBackButton = (event: any) => {
			// Custom logic here
			console.log('Back button pressed');
			dispatch(disconnect());
			// You can perform actions like redirecting the user here
		};

		window.addEventListener('popstate', handleBackButton);

		return () => {
			window.removeEventListener('popstate', handleBackButton);
		};
	}, []);

	return (
		<div
			className={`z-10 border white rounded-lg ${
				mapChoice === mapType.STANDARD ? 'px-8' : ''
			}`}
		>
			<div ref={canvasRef} />
		</div>
	);
};
