import { createSlice } from '@reduxjs/toolkit';

interface ConnectionState {
	//? What to put here?
	// isGameStarted: boolean;
	// isGameFinished: boolean;
	// isGamePaused: boolean;
	// isGameResumed: boolean;
	//
}

const initialState = {};

const connectionSlice = createSlice({
	name: 'connection',
	initialState,
	reducers: {
		//? What to put here?
	},
});

//* Action creators

//* Slice definitions
export const { setConnected } = connectionSlice.actions;
export const connectionReducer = connectionSlice.reducer;
