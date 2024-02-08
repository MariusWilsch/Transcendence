export enum Direction {
	UP = 0,
	DOWN = 1,
	STOPPED = 2,
}

export enum MatchType {
	PRIVATE,
	PUBLIC,
}

export interface PlayerMove {
	direction: Direction;
}

export interface MouseMove {
	yPos: number;
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
	};
	score: { player1: number; player2: number };
	canvasWidth: number;
	canvasHeight: number;
	userData: [
		{
			avatar: string;
			username: string;
		},
		{
			avatar: string;
			username: string;
		},
	];
}
