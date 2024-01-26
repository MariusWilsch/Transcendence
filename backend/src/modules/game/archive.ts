// 	// private updatePaddle(
// 	// 	{ position }: Paddle,
// 	// 	input: PlayerInput,
// 	// 	deltaTime: number
// 	// ) {
// 	// 	let didPaddleMove = false;
// 	// 	if (input.up) {
// 	// 		const x = 1 - Math.pow(0.25, deltaTime);
// 	// 		const targetY = position.y - GAME_CONFIG.canvasHeight * 0.5;
// 	// 		position.y = this.lerp(position.y, targetY, x);
// 	// 		console.log(position.y);

// 	// 		didPaddleMove = true;
// 	// 	} else if (input.down) {
// 	// 		const x = 1 - Math.pow(0.25, deltaTime);
// 	// 		const targetY = position.y + GAME_CONFIG.canvasHeight * 0.5;
// 	// 		position.y = this.lerp(position.y, targetY, x);
// 	// 		didPaddleMove = true;
// 	// 	}
// 	// 	return didPaddleMove;
// 	// }

// 	private updatePaddle(paddle: Paddle, input: PlayerInput, deltaTime: number) {
// 		let didPaddleMove = false;
// 		if (input.up) {
// 			paddle.position.y -= this.paddleSpeed * deltaTime;
// 			didPaddleMove = true;
// 		} else if (input.down) {
// 			paddle.position.y += this.paddleSpeed * deltaTime;
// 			didPaddleMove = true;
// 		}
// 		return didPaddleMove;
// 	}

// 	//! Wrong place here

// 	private lerp(a: number, b: number, x: number) {
// 		return a + x * (b - a);
// 	}

// 	//! Wrong Place here
// 	public updatePaddleMouse(paddle: Paddle, yPos: number) {
// 		this.mouseControlled = true;
// 		if (yPos + paddle.size.height > GAME_CONFIG.canvasHeight) return;
// 		paddle.position.y = yPos;
// }
	
// 	private AIUpdatePaddle(paddle: Paddle, ball: Ball, deltaTime: number) {
// 		const deltaY =
// 			ball.position.y - (paddle.position.y + paddle.size.height / 2);
// 		//! I think 0.013 for easy, 0.016 for medium and 0.018 for hard is good
// 		const difficulty = 0.013; // Adjust this to make the AI harder or easier

// 		// Move the paddle a fraction of the distance to the ball
// 		paddle.position.y += difficulty * deltaY * deltaTime * this.paddleSpeed;

// 		return true;
// 	}