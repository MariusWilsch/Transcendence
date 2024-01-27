import { MatchType } from '@/interfaces';
import { createAction, createSlice } from '@reduxjs/toolkit';
import { userAgent } from 'next/server';

export enum GameOutcome {
	WON = 'WON',
	LOST = 'LOST',
	DRAW = 'DRAW',
	NONE = 'NONE',
}

export enum ConnectionStatus {
	CONNECTED = 'CONNECTED',
	DISCONNECTED = 'DISCONNECTED',
}

export enum MatchmakingStatus {
	SEARCHING = 'SEARCHING',
	NOT_SEARCHING = 'NOT_SEARCHING',
}

export interface LobbyProps {
	matchType: MatchType;
	inviteeID?: string;
}

export interface ConnectionState {
	isConnected: ConnectionStatus; // The connection status of the user
	isInMatchmaking: MatchmakingStatus; // The matchmaking status of the user
	isGameStarted: boolean; // True if the game has started, false if finished
	isGamePaused: boolean; // True if the game is paused, false if resumed
	playerOutcome: GameOutcome; // The outcome of the game for the player
	gameData: {
		username: string;
		avatar: string;
	};
}

const initialState = {
	isConnected: ConnectionStatus.DISCONNECTED,
	isInMatchmaking: MatchmakingStatus.NOT_SEARCHING,
	playerOutcome: GameOutcome.NONE,
	isGameStarted: false,
	isGamePaused: false,
	gameData: {
		username: '',
		avatar: '',
	},
} as ConnectionState;

const connectionSlice = createSlice({
	name: 'connection',
	initialState,
	reducers: {
		//! This is kind of a reduancy as we also have ethe startConnection/Matchmaking action in gameSlice.ts
		//! Needs refactoring
		setConnectionStatus: (state, action) => {
			state.isConnected = action.payload;
		},
		setMatchmaking: (state, action) => {
			state.isInMatchmaking = action.payload;
		},
		gameStarted: (state) => {
			state.isGameStarted = true;
		},
		gameFinished: (state) => {
			state.isGameStarted = false;
		},
		gamePaused: (state) => {
			//* Not implemented yet
			state.isGamePaused = true;
		},
		gameResumed: (state) => {
			//* Not implemented yet
			state.isGamePaused = false;
		},
		setPlayerOutcome: (state, action) => {
			state.playerOutcome = action.payload;
		},
		setGameData: (state, action) => {
			state.gameData = action.payload;
		},
	},
});

//* Action creators
export const startLoop = createAction('connection/startLoop');
export const cancelMatchmaking = createAction('connection/cancelMatchmaking');
export const addToLobby = createAction<LobbyProps>('connection/addToLobby');

//* Slice definitions
export const {
	gameStarted,
	gameFinished,
	gamePaused,
	gameResumed,
	setPlayerOutcome,
	setConnectionStatus,
	setMatchmaking,
	setGameData,
} = connectionSlice.actions;
export const connectionReducer = connectionSlice.reducer;
