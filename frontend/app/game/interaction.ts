import { Direction } from '@/interfaces';
import { mouseMove, movePaddle } from '@/app/GlobalRedux/features';
import { MutableRefObject } from 'react';
import { Dispatch, AnyAction } from 'redux';

const updateDirection = (
	newDirection: Direction,
	dispatch: Dispatch<AnyAction>,
	currentDirection: MutableRefObject<Direction>,
) => {
	if (newDirection !== currentDirection.current) {
		dispatch(movePaddle({ direction: newDirection }));
		currentDirection.current = newDirection;
	}
};

export const handleKeyDown = (
	dispatch: Dispatch<AnyAction>,
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
	dispatch: Dispatch<AnyAction>,
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

//! Why is the paddle movement so smooth if I'm updating using the y postion of the mouse?
//! and not like with the keyboatd controls?
//! can the same be achieved with keybaoards and ball movement?
export const handleMouseMove = (
	dispatch: Dispatch<AnyAction>,
	e: MouseEvent,
	canvasRef: React.RefObject<HTMLDivElement>,
) => {
	if (canvasRef.current) {
		const canvasBounds = canvasRef.current.getBoundingClientRect();
		const relativeYPos = e.clientY - canvasBounds.top;

		console.log('relativeYPos: ', relativeYPos);

		dispatch(mouseMove({ yPos: relativeYPos }));
	}
};

// export const handleMouseMove = (
// 	dispatch: Dispatch<AnyAction>,
// 	currentDirection: MutableRefObject<Direction>,
// 	e: MouseEvent,
// 	lastPos: MutableRefObject<number | null>,
// 	lastTime: MutableRefObject<number>,
// ) => {
// 	const currentPos = e.clientY;

// 	if (lastPos.current === null) {
// 		lastPos.current = currentPos;
// 		lastTime.current = Date.now();
// 		return;
// 	}

// 	const currentTime = Date.now();
// 	const timeDiff = currentTime - lastTime.current;
// 	const distanceDiff = currentPos - lastPos.current;

// 	// Calculate the velocity (distance moved / by time taken)
// 	// If no time has passed, set velocity to 0 to avoid division by zero
// 	const velocity = timeDiff !== 0 ? distanceDiff / timeDiff : 0;

// 	console.log('velocity: ', velocity);

// 	let newDirection: Direction = Direction.STOPPED;
// 	// If the mouse is moving up, move the paddle up
// 	if (velocity < -0.01) newDirection = Direction.UP;
// 	// If the mouse is moving down, move the paddle down
// 	else if (velocity > 0.01) newDirection = Direction.DOWN;
// 	// If the mouse is stopped, stop the paddle
// 	else newDirection = Direction.STOPPED;

// 	console.log('newDirection: ', newDirection);

// 	lastTime.current = currentTime;
// 	lastPos.current = currentPos;

// 	// Call updateDirection with individual arguments
// 	updateDirection(newDirection, dispatch, currentDirection);
// };
