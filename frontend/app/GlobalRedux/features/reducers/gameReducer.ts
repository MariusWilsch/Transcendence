'use client';
import { createSlice } from '@reduxjs/toolkit';

export interface PlayerMove {
	playerID: number;
	direction: 'up' | 'down';
}

export interface GameState {
  paddles: { //! Optimse this at the end
    player1: {
      position: { x: number; y: number };
      size: { width: number; height: number };
    };
    player2: {
      position: { x: number; y: number };
      size: { width: number; height: number };
    };
  };
  ball: {
    position: { x: number; y: number };
    radius: number;
    velocity: { x: number; y: number };
  };
  score: { player1: number; player2: number };
}

const initialState: GameState = {
  paddles: {
    player1: { position: { x: 0, y: 0 }, size: { width: 0, height: 0 }},
    player2: { position: { x: 0, y: 0 }, size: { width: 0, height: 0 }},
  },
  ball: { position: { x: 0, y: 0 }, radius: 0, velocity: { x: 0, y: 0 } },
  score: { player1: 0, player2: 0 },
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
  },
});

export const { } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;


