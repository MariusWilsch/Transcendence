import { createSlice, createAction } from '@reduxjs/toolkit';

export enum aiDifficulty {
	EASY = 0,
	MEDIUM = 1,
	HARD = 2,
	NONE = 3,
}

export enum InputType {
	KEYBOARD = 'KEY',
	MOUSE = 'MOUSE',
	AI = 'AI',
}

export enum mapType {
	CLASSIC = 0,
	STANDARD = 1,
}

export interface GameConfigState {
	aiDifficulty: aiDifficulty;
	inputType: InputType;
	mapChoice: mapType;
}

const initialState = {
	aiDifficulty: aiDifficulty.NONE,
	inputType: InputType.MOUSE,
	mapChoice: mapType.STANDARD,
};

const gameConfigSlice = createSlice({
	name: 'gameConfig',
	initialState,
	reducers: {
		setAiDifficulty: (state, action) => {
			state.aiDifficulty = action.payload;
		},
		setInputType: (state, action) => {
			state.inputType = action.payload;
		},
		setMapChoice: (state, action) => {
			state.mapChoice = action.payload;
		},
		resetConfig: () => {
			return initialState;
		},
	},
});

//* Action creators
export const setupInteraction = createAction<GameConfigState>(
	'gameConfig/setupInteraction',
);

export const { setAiDifficulty, setInputType, setMapChoice, resetConfig } =
	gameConfigSlice.actions;
export const gameConfigReducer = gameConfigSlice.reducer;
