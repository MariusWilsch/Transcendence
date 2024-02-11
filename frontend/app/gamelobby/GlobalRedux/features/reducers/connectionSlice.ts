import { createAction, createSlice } from '@reduxjs/toolkit';
import { aiDifficulty } from '..';

export enum GameOutcome {
	WON = 'WON',
	LOST = 'LOST',
	DRAW = 'DRAW',
	NONE = 'NONE',
}

export enum Invite {
	INVITING,
	ACCEPTING,
	REJECTING,
}

export enum ConnectionStatus {
	CONNECTED = 'CONNECTED',
	DISCONNECTED = 'DISCONNECTED',
}

export enum MatchmakingStatus {
	SEARCHING = 'SEARCHING',
	NOT_SEARCHING = 'NOT_SEARCHING',
	DUPLICATE = 'DUPLICATE',
}

interface PrivateMatch {
	inviteeID: string | undefined;
	accepted?: boolean;
}

export interface ConnectionState {
	isConnected: ConnectionStatus; // The connection status of the user
	isInMatchmaking: MatchmakingStatus; // The matchmaking status of the user
	isGameStarted: boolean; // True if the game has started, false if finished
	playerOutcome: GameOutcome; // The outcome of the game for the player
	gameData: {
		username: string;
		avatar: string;
	};
	countDownDone: boolean;
	privateMatch: boolean;
}

const initialState = {
	isConnected: ConnectionStatus.DISCONNECTED,
	isInMatchmaking: MatchmakingStatus.NOT_SEARCHING,
	playerOutcome: GameOutcome.NONE,
	isGameStarted: false,
	gameData: {
		username: '',
		avatar: '',
	},
	countDownDone: false,
	privateMatch: false,
} as ConnectionState;

const connectionSlice = createSlice({
	name: 'connection',
	initialState,
	reducers: {
		setConnectionStatus: (state, action) => {
			state.isConnected = action.payload;
		},
		setMatchmaking: (state, action) => {
			state.isInMatchmaking = action.payload;
		},
		gameStarted: (state) => {
			state.isGameStarted = true;
			state.isInMatchmaking = MatchmakingStatus.NOT_SEARCHING;
			state.playerOutcome = GameOutcome.NONE;
		},
		gameFinished: (state) => {
			state.isGameStarted = false;
			state.countDownDone = false;
			state.playerOutcome = GameOutcome.NONE;
			state.privateMatch = false;
		},
		setPlayerOutcome: (state, action) => {
			state.playerOutcome = action.payload;
		},
		setGameData: (state, action) => {
			state.gameData = action.payload;
		},
		setCountDownDone: (state, action) => {
			state.countDownDone = action.payload;
		},
		setPrivateMatch: (state, action) => {
			state.privateMatch = action.payload;
		},
	},
});

//* Action creators
export const startConnection = createAction('connection/startConnection');
export const disconnect = createAction('connection/disconnect');
export const addToLobby = createAction<aiDifficulty>('connection/addToLobby');
export const cancelMatchmaking = createAction('connection/cancelMatchmaking');
export const startLoop = createAction('connection/startLoop');
export const invitePrivate = createAction<PrivateMatch>(
	'connection/invitePrivate',
);
export const acceptPrivate = createAction<PrivateMatch>(
	'connection/acceptPrivate',
);

//* Slice definitions
export const {
	gameStarted,
	gameFinished,
	setPlayerOutcome,
	setConnectionStatus,
	setMatchmaking,
	setGameData,
	setCountDownDone,
	setPrivateMatch,
} = connectionSlice.actions;
export const connectionReducer = connectionSlice.reducer;
