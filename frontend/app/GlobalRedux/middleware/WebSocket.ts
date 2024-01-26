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

let ClientSocket: Socket | null = null;
let AISocket: Socket | null = null;

//* Helper functions for WebSocket middleware
const connect = (store: MiddlewareStore, socket: Socket | null) => {
	socket = io('http://localhost:3001');

	socket.on('connect', () => console.log('Connected to server'));

	socket.on('disconnect', () => {
		console.log('Disconnected from server');
		store.dispatch(gameFinished());
		store.dispatch(setMatchmaking(MatchmakingStatus.NOT_SEARCHING));
	});

	socket.on('createGame', (gameState: GameState) => {
		console.log('Game created');
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
	return socket;
};

export const socketMiddleware: Middleware = (store) => (next) => (action) => {
	if (action.type === 'game/startConnection' && !ClientSocket)
		ClientSocket = connect(store, ClientSocket);

	switch (action.type) {
		case 'game/movePaddle':
			ClientSocket?.emit('onPaddleMove', action.payload);
			break;
		case 'game/mouseMove':
			ClientSocket?.emit('onMouseMove', action.payload);
			break;
		case 'connection/startLoop':
			console.log('startLoop');

			ClientSocket?.emit('startLoop', action.payload);
			break;
		case 'connection/cancelMatchmaking':
			ClientSocket?.emit('cancelMatchmaking');
			break;
		case 'connection/addToLobby':
			ClientSocket?.emit('addToLobby');
			break;
		case 'gameConfig/setupInteraction':
			console.log('setupInteraction');
			ClientSocket?.emit('setupInteraction', action.payload);
			break;
		case 'gameConfig/setupAIMatch':
			AISocket = connect(store, AISocket);
			AISocket?.emit('setupAIMatch', action.payload);
		//* Can be expanded to handle more actions - Add below
		default:
			break;
	}
	return next(action);
};
