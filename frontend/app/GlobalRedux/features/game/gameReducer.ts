'use client';
import { createSlice } from '@reduxjs/toolkit';
import { create } from 'domain';

/**
 * Initial state of the game.
 * @typedef {Object} initialState
 * @property {number} score - The current score.
 * @property {Object} paddleA - The position of paddle A.
 * @property {number} paddleA.x - The x-coordinate of paddle A.
 * @property {number} paddleA.y - The y-coordinate of paddle A.
 * @property {Object} paddleB - The position of paddle B.
 * @property {number} paddleB.x - The x-coordinate of paddle B.
 * @property {number} paddleB.y - The y-coordinate of paddle B.
 * @property {Object} ball - The position of the ball.
 * @property {number} ball.x - The x-coordinate of the ball.
 * @property {number} ball.y - The y-coordinate of the ball.
 */
const initialState = {
	score: 0,
	paddleA: { x: 50, y: 300 },
	paddleB: { x: 750, y: 300 },
	ball: { x: 400, y: 300 },
};

const gameSlice = createSlice({
	name: 'game',
	initialState,
	reducers: {
		updateScore(state, action) {
			state.score = action.payload;
		},
	},
});

export const { updateScore } = gameSlice.actions; // export the action creators
export const gameReducer = gameSlice.reducer; // export the reducer

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
