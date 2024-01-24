import { createSlice } from '@reduxjs/toolkit';

export enum aiDifficulty {
	EASY = 0,
	MEDIUM = 1,
	HARD = 2,
	NONE = 3,
}

export enum mouseOrKeyboard {
	KEYBOARD = 0,
	MOUSE = 1,
}

export enum mapChoice {
	CLASSIC = 0,
	STANDARD = 1,
}

export interface GameConfigState {
	aiDifficulty: aiDifficulty;
	mouseOrKeyboard: mouseOrKeyboard;
	mapChoice: mapChoice;
}

const initialState = {
	aiDifficulty: aiDifficulty.NONE,
	mouseOrKeyboard: mouseOrKeyboard.KEYBOARD,
	mapChoice: mapChoice.STANDARD,
};

const gameConfigSlice = createSlice({
	name: 'gameConfig',
	initialState,
	reducers: {
		setAiDifficulty: (state, action) => {
			state.aiDifficulty = action.payload;
		},
		setMouseOrKeyboard: (state, action) => {
			state.mouseOrKeyboard = action.payload;
		},
		setMapChoice: (state, action) => {
			state.mapChoice = action.payload;
		},
	},
});

//* Action creators
export const { setAiDifficulty, setMouseOrKeyboard, setMapChoice } =
	gameConfigSlice.actions;
export const gameConfigReducer = gameConfigSlice.reducer;
