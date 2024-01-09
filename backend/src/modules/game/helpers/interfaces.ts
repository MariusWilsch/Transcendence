import { Socket } from 'socket.io';

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

// Structure to keep track of player associations within a game session
export interface GameSession {
	players: Socket[];
	gameState: GameState;
	intervalID: NodeJS.Timeout | null;
	input: PaddleInput;
}

//* Not sure if this is needed
export interface PaddleMove {
	direction: 'up' | 'down' | 'stop';
	player: 'player1' | 'player2';
}

export interface PaddleInput {
	player1: { up: boolean; down: boolean };
	player2: { up: boolean; down: boolean };
}
