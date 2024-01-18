import { createAction, createSlice } from '@reduxjs/toolkit';

export enum GameOutcome {
	WON = 'WON',
	LOST = 'LOST',
	DRAW = 'DRAW',
	NONE = 'NONE',
}

export interface ConnectionState {
	isGameStarted: boolean; // True if the game has started, false if finished
	isGamePaused: boolean; // True if the game is paused, false if resumed
	playerOutcome: GameOutcome; // The outcome of the game for the player
	// isConnected : boolean; // True if the user is connected, false if not //? Necessary?
}

const initialState = {
	isGameStarted: false,
	isGamePaused: false,
	playerOutcome: GameOutcome.NONE,
};

const connectionSlice = createSlice({
	name: 'connection',
	initialState,
	reducers: {
		gameStarted: (state) => {
			state.isGameStarted = true;
		},
		gameFinished: (state) => {
			state.isGameStarted = false;
		},
		gamePaused: (state) => {
			state.isGamePaused = true;
		},
		gameResumed: (state) => {
			state.isGamePaused = false;
		},
		setPlayerOutcome: (state, action) => {
			state.playerOutcome = action.payload;
		},
	},
});

//* Action creators
export const startLoop = createAction('connection/startLoop');

//* Slice definitions
export const {
	gameStarted,
	gameFinished,
	gamePaused,
	gameResumed,
	setPlayerOutcome,
} = connectionSlice.actions;
export const connectionReducer = connectionSlice.reducer;
