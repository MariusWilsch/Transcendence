'use client';
import { log } from 'console';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import Game from './game/Game';

// interface coords {
// 	x: number;
// 	y: number;
// }

// interface GameState {
// 	score: number;
// 	paddleA: coords;
// 	paddleB: coords;
// 	ball: coords;
// }

// interface RootState {
// 	game: GameState;
// }

export default function Home() {
	return (
		<main>
			<Game />
		</main>
	);
}
