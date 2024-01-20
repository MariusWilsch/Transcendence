import { MiddlewareAPI, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import {
	initGame,
	updateGame,
	gameStarted,
	gameFinished,
	setPlayerOutcome,
	GameOutcome,
	MatchmakingStatus,
	setMatchmaking,
} from '../features';
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

	socket.on('connect', () => console.log('Connected to server'));

	socket.on('disconnect', () => {
		console.log('Disconnected from server');
		store.dispatch(gameFinished());
		store.dispatch(setMatchmaking(MatchmakingStatus.NOT_SEARCHING));
	});

	socket.on('createGame', (gameState: GameState) => {
		console.log('Game created', socket?.id);
		store.dispatch(initGame(gameState));
		//! Will be set twice, once for each player
		store.dispatch(gameStarted());
		store.dispatch(setMatchmaking(MatchmakingStatus.NOT_SEARCHING));
	});

	socket.on('gameState', (gameState: GameState) =>
		store.dispatch(updateGame(gameState)),
	);

	socket.on('gameOver', (won: boolean) => {
		//! Will be set twice, once for each player
		store.dispatch(gameFinished());
		const outcome = won ? GameOutcome.WON : GameOutcome.LOST;
		store.dispatch(setPlayerOutcome(outcome));
	});
};

export const socketMiddleware: Middleware = (store) => (next) => (action) => {
	if (action.type === 'game/startConnection' && !socket) connect(store);

	switch (action.type) {
		case 'game/movePaddle':
			socket?.emit('onPaddleMove', action.payload);
			break;
		case 'connection/startLoop':
			socket?.emit('startLoop');
			break;
		case 'connection/cancelMatchmaking':
			socket?.emit('cancelMatchmaking');
			break;
		case 'connection/addToLobby':
			socket?.emit('addToLobby');
			break;
		//* Can be expanded to handle more actions - Add below
		default:
			break;
	}
	return next(action);
};
