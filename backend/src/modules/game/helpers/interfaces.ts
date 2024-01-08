interface Vector {
	x: number;
	y: number;
}

interface Size {
	width: number;
	height: number;
}

interface Paddle {
	position: Vector;
	size: Size;
	yCordSpeed: number;
}

interface Ball {
	position: Vector;
	radius: number;
	velocity: Vector;
}

interface Score {
	player1: number;
	player2: number;
}

//* Not sure if this is needed
// export interface PaddleMove {
// 	direction: 'up' | 'down' | 'stop';
// }

// export interface GameState {
// 	clients: { [clientId: string]: Paddle };
// 	ball: Ball;
// 	score: { [clientId: string]: number };
// 	canvas: { width: number; height: number };
// }

// export interface GameState {
// 	paddles: { player1: Paddle; player2: Paddle };
// 	ball: Ball;
// 	score: { player1: number; player2: number };
// 	canvas: { width: number; height: number };
// }

// Structure to represent the state of the game (paddles, ball, score, etc.)
export interface GameState {
	paddles: {
		player1: Paddle;
		player2: Paddle;
	};
	ball: Ball;
	score: Score;
	canvas: {
		//! Should that be in the game config?
		width: number;
		height: number;
	};
}

// Structure to keep track of player associations within a game session
export interface PlayerSession {
	playersID: string[];
	gameState: GameState;
}

// export interface GameSessions {
// 	[roomID: string]: GameState;
// 	intervalID: NodeJS.Timeout;
// }
