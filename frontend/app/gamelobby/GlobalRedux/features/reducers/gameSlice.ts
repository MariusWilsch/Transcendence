import { createAction, createSlice } from '@reduxjs/toolkit';
import { GameState, MouseMove, PlayerMove } from '@/interfaces';

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
	canvasWidth: 0,
	canvasHeight: 0,
	userData: [
		{
			avatar: '',
			username: '',
		},
		{
			avatar: '',
			username: '',
		},
	],
};

const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		initGame: (state, action) => {
			state.paddles = action.payload.paddles;
			state.ball = action.payload.ball;
			state.canvasHeight = action.payload.canvasHeight;
			state.canvasWidth = action.payload.canvasWidth;
			state.userData = action.payload.userData;
		},
		updateGame: (state, action) => {
			state.paddles = action.payload.paddles;
			state.ball = action.payload.ball;
			state.score = action.payload.score;
		},
	},
});

//* Action creators
export const movePaddle = createAction<PlayerMove>('game/movePaddle');
export const mouseMove = createAction<MouseMove>('game/mouseMove');

//! I think this one should go to connectionSlice.ts

//* Slice definitions
export const { initGame, updateGame } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
