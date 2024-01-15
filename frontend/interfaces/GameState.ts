export interface PlayerMove {
	playerID: number;
	direction: 'up' | 'down';
}

export interface GameState {
	paddles: {
		//! Optimse this at the end
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
