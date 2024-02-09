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
	direction?: Direction;
	yPos?: number;
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

export interface Score {
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
	yPos: number | null;
}

export interface PaddleControlCommand {
	execute(deltaTime: number, input: PlayerInput): boolean;
}

export interface Players {
	playerSockets: Socket;
	playerIDs: string;
}

export interface GameResult {
	winnerId: string;
	loserId: string;
	score: string;
	result: boolean[];
	outcome: MatchOutcome;
}

interface UserData {
	avatar: string;
	username: string;
}

// Structure to keep track of player associations within a game session
export interface GameSession {
	ballVelocity: Vector;
	players: Players[];
	gameState: GameState;
	intervalID: NodeJS.Timeout | undefined;
	input: PlayerInput[];
	command: PaddleControlCommand[];
	userData: UserData[];
	aiMatch : boolean;
}

//* Client side interfaces

export enum AiDifficulty {
	EASY = 0,
	MEDIUM = 1,
	HARD = 2,
	NONE = 3,
}

export enum InputType {
	KEYBOARD = 'KEY',
	MOUSE = 'MOUSE',
	AI = 'AI',
}

export enum MapChoice {
	CLASSIC = 0,
	STANDARD = 1,
}

export interface GameConfigState {
	aiDifficulty: AiDifficulty;
	inputType: InputType;
	mapChoice: MapChoice;
}

export enum MatchOutcome {
	FINISHED,
	UNDEFINED,
}

export enum MatchType {
	PRIVATE,
	PUBLIC,
}
