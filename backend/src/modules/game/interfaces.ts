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

//* Not sure if this is needed
// interface PaddleMove {
// 	playerID: number;
// 	direction: 'up' | 'down';
// }

export interface GameState {
	paddles: { player1: Paddle; player2: Paddle };
	ball: Ball;
	score: { player1: number; player2: number };
	canvas: { width: number; height: number };
}
