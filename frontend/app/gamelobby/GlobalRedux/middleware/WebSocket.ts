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
	setMatchmaking,
	MatchmakingStatus,
	resetScore,
} from '../features';
import { GameState, MiddlewareStore, Middleware } from '@/interfaces';
import Cookies from 'universal-cookie';
import { FaPersonWalkingDashedLineArrowRight } from 'react-icons/fa6';

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
		store.dispatch(setConnectionStatus(ConnectionStatus.CONNECTED));
	});

	socket.on('disconnect', () => {
		console.log('Disconnected from server');
		store.dispatch(gameFinished());
		store.dispatch(setConnectionStatus(ConnectionStatus.DISCONNECTED));
	});

	socket.on('duplicateRequest', () => {
		console.log('Duplicate request');
		store.dispatch(setMatchmaking(MatchmakingStatus.DUPLICATE));
	});

	socket.on('createGame', (gameState: GameState) => {
		store.dispatch(initGame(gameState));
		//* Will be set twice, once for each player
		store.dispatch(gameStarted());
	});

	socket.on('gameState', (gameState: GameState) => {
		store.dispatch(updateGame(gameState));
	});

	socket.on('test', () => console.log('Test received'));

	socket.on('gameOver', (won: boolean) => {
		//* Will be set twice, once for each player
		store.dispatch(gameFinished());
		const outcome = won ? GameOutcome.WON : GameOutcome.LOST;
		store.dispatch(setPlayerOutcome(outcome));
	});
	return socket;
};

export const socketMiddleware: Middleware = (store) => (next) => (action) => {
	if (action.type === 'game/startConnection')
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
			store.dispatch(setMatchmaking(MatchmakingStatus.NOT_SEARCHING));
			ClientSocket?.emit('cancelMatchmaking');
			break;
		case 'connection/addToLobby':
			ClientSocket?.emit('addToLobby');
			break;
		case 'gameConfig/setupInteraction':
			ClientSocket?.emit('setupInteraction', action.payload);
			break;
		case 'connection/disconnect':
			ClientSocket?.disconnect();
			break;
		case 'connection/invitePrivate':
			ClientSocket?.emit('invitePrivate', action.payload);
			break;
		case 'connection/acceptPrivate':
			ClientSocket?.emit('acceptPrivate', action.payload);
			break;
		case 'connection/otherSocket':
			ClientSocket?.emit('otherSocket', action.payload);
		case 'gameConfig/setupAIMatch':
			AISocket = connect(store, AISocket);
			AISocket?.emit('setupAIMatch', action.payload);
		//* Can be expanded to handle more actions - Add below
		default:
			break;
	}
	return next(action);
};
