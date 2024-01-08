'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PlayerMove {
	playerID: number;
	direction: 'up' | 'down';
}

export interface GameState {
  paddles: {
    player1: {
      position: { x: number; y: number };
      size: { width: number; height: number };
      yCordSpeed: number;
    };
    player2: {
      position: { x: number; y: number };
      size: { width: number; height: number };
      yCordSpeed: number;
    };
  };
  ball: {
    position: { x: number; y: number };
    radius: number;
    velocity: { x: number; y: number };
  };
  score: { player1: number; player2: number };
	canvas: { width: number; height: number };
}

const initialState: GameState = {
  paddles: {
    player1: { position: { x: 0, y: 0 }, size: { width: 0, height: 0 }, yCordSpeed: 0 },
    player2: { position: { x: 0, y: 0 }, size: { width: 0, height: 0 }, yCordSpeed: 0 },
  },
  ball: { position: { x: 0, y: 0 }, radius: 0, velocity: { x: 0, y: 0 } },
  score: { player1: 0, player2: 0 },
	canvas: { width: 0, height: 0 },
	playerMove: undefined
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameState(state, action: PayloadAction<GameState>) {
      return action.payload;
		},
		setPlayerMove(state, action: PayloadAction<PlayerMove>) {
			state.playerMove = action.payload;
		} //! Currently not in use
  },
});

export const { setGameState, setPlayerMove } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;

// const anecdoteSlice = createSlice({
// 	name: 'anecdote',
// 	initialState: [],
// 	reducers: {
// 		append(state, action) {
// 			state.push(action.payload);
// 		},
// 		incVote(state, { payload: { id, votes } }) {
// 			const anecdoteToUpdate = state.find((anecdote) => anecdote.id === id);
// 			if (anecdoteToUpdate) anecdoteToUpdate.votes = votes;
// 		},
// 		initializeAnecdotes: (state, action) => {
// 			return action.payload;
// 		},
// 	},
// });
