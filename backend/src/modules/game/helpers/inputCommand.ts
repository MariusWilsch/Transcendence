import { GAME_CONFIG } from './game.constants';
import {
	PlayerInput,
	Paddle,
	Ball,
	InputType,
	AiDifficulty,
	PaddleControlCommand,
} from './interfaces';

//* 2. Define a command classes

//* 2.1 KeyboardCommand
export class KeyboardCommand implements PaddleControlCommand {
	constructor(
		private paddle: Paddle,
		private speed: number
	) {}
	execute(deltaTime: number, { up, down }: PlayerInput): boolean {
		if (up) {
			this.paddle.position.y -= this.speed * deltaTime;
		}
		if (down) {
			this.paddle.position.y += this.speed * deltaTime;
		}
		return true;
	}
}

//* 2.2 MouseCommand
export class MouseCommand implements PaddleControlCommand {
	constructor(private paddle: Paddle) {}
	execute(deltaTime: number, { yPos }: PlayerInput): boolean {
		if (yPos + this.paddle.size.height / 2 > GAME_CONFIG.canvasHeight)
			return false;
		this.paddle.position.y = yPos;
		return true;
	}
}

//* 2.3 AI Command

export class AICommand implements PaddleControlCommand {
	constructor(
		private paddle: Paddle,
		private ball: Ball,
		private speed: number,
		private difficulty: number
	) {}
	execute(deltaTime: number, input: PlayerInput): boolean {
		const { position, size } = this.paddle;
		const deltaY = this.ball.position.y - (position.y + size.height / 2);
		position.y += deltaY * this.speed * deltaTime * this.difficulty;
		return true;
	}
}

//* Helpers

interface CommandProps {
	paddle: Paddle;
	input?: PlayerInput;
	speed?: number;
	ball?: Ball;
	yPos?: number;
	difficulty?: number;
}

export const createCommand = (
	type: InputType,
	{ paddle, speed, ball, difficulty }: CommandProps
): PaddleControlCommand => {
	switch (type) {
		case InputType.AI:
			if (AiDifficulty.EASY) difficulty = 0.013;
			else if (AiDifficulty.MEDIUM) difficulty = 0.15;
			else if (AiDifficulty.HARD) difficulty = 0.18;
			return new AICommand(paddle, ball, speed, difficulty);
		case InputType.KEYBOARD:
			return new KeyboardCommand(paddle, speed);
		case InputType.MOUSE:
			return new MouseCommand(paddle);
	}
};
