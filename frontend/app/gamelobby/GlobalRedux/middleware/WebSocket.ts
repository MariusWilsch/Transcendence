import { io, Socket } from 'socket.io-client';
import {
	initGame,
	updateGame,
	gameStarted,
	gameFinished,
	setPlayerOutcome,
	GameOutcome,
	ConnectionStatus,
	setConnectionStatus,
} from '../features';
import { GameState, MiddlewareStore, Middleware } from '@/interfaces';
import Cookies from 'universal-cookie';

//* Global variables
let ClientSocket: Socket | null = null;
let AISocket: Socket | null = null;
const cookies = new Cookies();

//* Helper functions for WebSocket middleware
const connect = (store: MiddlewareStore, socket: Socket | null) => {
	const token = cookies.get('jwt');

	if (!token) {
		console.log('Client does not have a valid token');
		//! Some alert that he needs to login again
		return;
	}

	socket = io('http://localhost:3001', {
		auth: {
			token,
		},
	});

	socket.on('connect', () => {
		console.log('Connected to server');
	});

	socket.on('disconnect', () => {
		console.log('Disconnected from server');
		store.dispatch(gameFinished());
		store.dispatch(setConnectionStatus(ConnectionStatus.DISCONNECTED));
	});

	socket.on('duplicateSocket', (payload: boolean) => {
		console.log('duplicateSocket');
		if (payload == false)
			return store.dispatch(setConnectionStatus(ConnectionStatus.CONNECTED));
		console.log('Duplicate user detected');
		store.dispatch(setConnectionStatus(ConnectionStatus.DUPLICATE));
		socket.disconnect();
	});

	socket.on('createGame', (gameState: GameState) => {
		store.dispatch(initGame(gameState));
		//* Will be set twice, once for each player
		store.dispatch(gameStarted());
	});

	socket.on('gameState', (gameState: GameState) =>
		store.dispatch(updateGame(gameState)),
	);

	socket.on('opponentDisconnected', () => {
		console.log('Opponent disconnected');
		store.dispatch(gameFinished());
	});

	socket.on('gameOver', (won: boolean) => {
		//* Will be set twice, once for each player
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
