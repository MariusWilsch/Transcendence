import { Direction } from '@/interfaces';
import { mouseMove, movePaddle } from '@/app/gamelobby/GlobalRedux/features';
import { MutableRefObject } from 'react';
import { Dispatch, UnknownAction } from 'redux';
import { GameService } from './GameService';

const updateDirection = (
	newDirection: Direction,
	dispatch: Dispatch<UnknownAction>,
	currentDirection: MutableRefObject<Direction>,
) => {
	if (newDirection !== currentDirection.current) {
		dispatch(movePaddle({ direction: newDirection }));
		currentDirection.current = newDirection;
	}
};

export const handleKeyDown = (
	dispatch: Dispatch<UnknownAction>,
	currentDirection: MutableRefObject<Direction>,
	e: KeyboardEvent,
) => {
	let newDirection: Direction;

	switch (e.key) {
		case 'w':
			newDirection = Direction.UP;
			break;
		case 's':
			newDirection = Direction.DOWN;
			break;
		default:
			return;
	}

	// Call updateDirection with individual arguments
	updateDirection(newDirection, dispatch, currentDirection);
};

export const handleKeyUp = (
	dispatch: Dispatch<UnknownAction>,
	currentDirection: MutableRefObject<Direction>,
	e: KeyboardEvent,
) => {
	if (
		(e.key === 'w' && currentDirection.current === Direction.UP) ||
		(e.key === 's' && currentDirection.current === Direction.DOWN)
	) {
		// Call updateDirection with individual arguments
		updateDirection(Direction.STOPPED, dispatch, currentDirection);
	}
};

export const handleMouseMove = (
	dispatch: Dispatch<UnknownAction>,
	e: MouseEvent,
	canvasRef: React.RefObject<HTMLDivElement>,
	serviceRef: GameService | null,
) => {
	if (!canvasRef.current || !serviceRef) return;

	const canvasBounds = canvasRef.current.getBoundingClientRect();
	const frontendHeight = serviceRef.getCanvasSize().height;

	// Calculate relative Y position within the frontend canvas
	let relativeYPos = e.clientY - canvasBounds.top;

	// Adjust relativeYPos to ensure it's within the frontend canvas bounds
	relativeYPos = Math.max(0, Math.min(relativeYPos, frontendHeight));

	// Calculate the proportional position within the backend coordinate system
	// No direct scaleY multiplication needed here; we're mapping proportionally
	const proportionalYPos = (relativeYPos / frontendHeight) * 400; // 400 is the backend's canvas height

	// Dispatch the mouse move with the Y position mapped to the backend's coordinate space
	dispatch(mouseMove({ yPos: proportionalYPos }));
};
