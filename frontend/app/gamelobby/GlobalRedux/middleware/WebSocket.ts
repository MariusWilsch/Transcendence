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
	resetConfig,
	addToLobby,
	aiDifficulty,
	resetScore,
} from '../features';
import { GameState, MiddlewareStore, Middleware } from '@/interfaces';
import Cookies from 'universal-cookie';

//* Global variables
let ClientSocket: Socket | undefined = undefined;
const cookies = new Cookies();
//* Helper functions for WebSocket middleware
const connect = (store: MiddlewareStore, socket: Socket | undefined) => {
	const token = cookies.get('jwt');

	// console.log(token);

	if (!token) {
		// console.log('Client does not have a valid token');
		alert('You are not logged in');
		return;
	}

	socket = io(`${process.env.NEXT_PUBLIC_API_URL}:3001`, {
		auth: { token },
		reconnection: false,
	});

	if (!socket) return;

	socket.on('connect', () => {
		// console.log('Connected to server');
		store.dispatch(setConnectionStatus(ConnectionStatus.CONNECTED));
	});

	socket.on('disconnect', () => {
		if (socket?.active === false)
			setConnectionStatus(ConnectionStatus.DISCONNECTED);
		// console.log('Disconnected from server');
		store.dispatch(gameFinished());
		store.dispatch(setConnectionStatus(ConnectionStatus.DISCONNECTED));
		store.dispatch(setMatchmaking(MatchmakingStatus.NOT_SEARCHING));
	});

	socket.on('duplicateRequest', () => {
		// console.log('Duplicate request');
		alert('You are already connected on another tab');
		store.dispatch(setMatchmaking(MatchmakingStatus.DUPLICATE));
		socket?.disconnect();
	});

	socket.on('connectionSuccess', () => {
		const connection = store.getState().connection;
		if (connection.privateMatch == false)
			store.dispatch(addToLobby(store.getState().gameConfig.aiDifficulty));
	});

	socket.on('createGame', (gameState: GameState) => {
		store.dispatch(initGame(gameState));
		//* Will be set twice, once for each player
		store.dispatch(gameStarted());
		store.dispatch(setMatchmaking(MatchmakingStatus.NOT_SEARCHING));
	});

	socket.on('gameState', (gameState: GameState) => {
		store.dispatch(updateGame(gameState));
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
	if (action.type === 'connection/startConnection')
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
			if (action.payload === aiDifficulty.NONE)
				store.dispatch(setMatchmaking(MatchmakingStatus.SEARCHING));
			ClientSocket?.emit('addToLobby', action.payload);
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
		//* Action creators middleware
		case 'connection/gameFinished':
			store.dispatch(resetConfig());
			break;
		case 'game/sendCtxDimensions':
			ClientSocket?.emit('sendCtxDimensions', action.payload);
			break;
		//* Can be expanded to handle more actions - Add below
		default:
			break;
	}
	return next(action);
};
