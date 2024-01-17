import { createAction, createSlice } from '@reduxjs/toolkit';
import { GameState } from '@/interfaces/GameState';

const initialState: GameState = {
	paddles: {
		player1: {
			position: { x: 0, y: 0 },
			size: { width: 0, height: 0 },
		},
		player2: {
			position: { x: 0, y: 0 },
			size: { width: 0, height: 0 },
		},
	},
	ball: {
		position: { x: 0, y: 0 },
		radius: 0,
		velocity: { x: 0, y: 0 },
	},
	score: { player1: 0, player2: 0 },
};

const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		initGame: (state, action) => {
			state.paddles = action.payload.paddles;
			state.ball = action.payload.ball;
		},
		updateGame: (state, action) => {
			state.paddles = action.payload.paddles;
			state.ball = action.payload.ball;
			state.score = action.payload.score;
		},
	},
});

//* Action creators
export const movePaddle = createAction('game/movePaddle');

export const startConnection = createAction('game/startConnection');

export const { initGame, updateGame } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
