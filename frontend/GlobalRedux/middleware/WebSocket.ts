import { MiddlewareAPI, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import { initGame, setConnected, updateGame } from '../features';
import { GameState } from '@/interfaces/GameState';

// Types
type MiddlewareStore = MiddlewareAPI<Dispatch<AnyAction>>;
type MiddlewareNext = Dispatch<AnyAction>;
type MiddlewareAction = AnyAction;

// Middleware interface
interface Middleware {
	(store: MiddlewareStore): (
		next: MiddlewareNext,
	) => (action: MiddlewareAction) => any;
}

let socket: Socket | null = null;

//* Helper functions for WebSocket middleware
const connect = (store: MiddlewareStore) => {
	socket = io('http://localhost:3001');

	socket.on('connect', () => {
		console.log('Connected to server');
		// dispatch(setConnected(true));
	});

	socket.on('disconnect', () => console.log('Disconnected from server'));

	socket.on('createGame', (gameState: GameState) =>
		store.dispatch(initGame(gameState)),
	);

	socket.on('gameState', (gameState: GameState) =>
		store.dispatch(updateGame(gameState)),
	);
};

export const socketMiddleware: Middleware = (store) => (next) => (action) => {
	if (action.type === 'game/startConnection' && !socket) connect(store);

	switch (action.type) {
		case 'game/movePaddle':
			socket?.emit('onPaddleMove', action.payload);
			break;
		//* Can be expanded to handle more actions - Add below
		default:
			break;
	}
	return next(action);
};
