import { MiddlewareAPI, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import { initGame, updateGame } from '../features';

type MiddlewareStore = MiddlewareAPI<Dispatch<AnyAction>>;
type MiddlewareNext = Dispatch<AnyAction>;
type MiddlewareAction = AnyAction;

let socket: Socket | null = null;

//* Helper functions for WebSocket middleware
const connect = (store: MiddlewareStore) => {
	socket = io('http://localhost:3001');

	socket.on('connect', () => console.log('Connected to server'));

	socket.on('disconnect', () => console.log('Disconnected from server'));

	socket.on('createGame', (gameState: any) =>
		store.dispatch(initGame(gameState)),
	);

	socket.on('gameState', (gameState: any) =>
		store.dispatch(updateGame(gameState)),
	);
};

type MiddlewareFunction = (
	store: MiddlewareStore,
) => (next: MiddlewareNext) => (action: MiddlewareAction) => any;

export const socketMiddleware: MiddlewareFunction =
	(store) => (next) => (action) => {
		if (action.type === 'game/startConnection' && !socket) {
			connect(store);
		}

		//* Can be expanded to handle more actions
		switch (action.type) {
			case 'game/movePaddle':
				socket?.emit('onPaddleMove', action.payload);
				break;
			default:
				break;
		}
		return next(action);
	};
