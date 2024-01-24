import { Socket } from 'socket.io';

export enum Player {
	P1 = 0,
	P2 = 1,
}

export enum Direction {
	UP = 0,
	DOWN = 1,
	STOP = 2,
}

//* Not sure if this is needed
export interface PlayerMove {
	direction: Direction;
}

export interface Vector {
	x: number;
	y: number;
}

export interface Size {
	width: number;
	height: number;
}

export interface Paddle {
	position: Vector;
	size: Size;
}

export interface Ball {
	position: Vector;
	radius: number;
}

interface Score {
	player1: number;
	player2: number;
}

// Structure to represent the state of the game (paddles, ball, score, etc.)
export interface GameState {
	paddles: {
		player1: Paddle;
		player2: Paddle;
	};
	ball: Ball;
	score: Score;
}

export interface PlayerInput {
	up: boolean;
	down: boolean;
}

// Structure to keep track of player associations within a game session
export interface GameSession {
	ballVelocity: Vector;
	players: Socket[];
	gameState: GameState;
	intervalID: NodeJS.Timeout | null;
	input: PlayerInput[];
}
