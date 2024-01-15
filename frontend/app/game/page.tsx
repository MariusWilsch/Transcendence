import React from 'react';
import { Stats, GameCanvas } from './GameCanvas';
import { ScoreProvider } from '../ScoreContext/ScoreContext';

const GameHeader = () => {
	return (
		<div className="h-1/4 flex items-center justify-evenly">
			<Stats scorePos={'left'} />
			<Stats scorePos={'right'} />
		</div>
	);
};

const GameCanvasWrapper = () => {
	return (
		<div className="h-3/4 flex items-center justify-center">
			<GameCanvas />
		</div>
	);
};

const Game = () => {
	return (
		<ScoreProvider>
			<div className="flex flex-col items-center h-full">
				<div className="flex flex-col w-3/5 h-full py-8">
					<GameHeader />
					<GameCanvasWrapper />
				</div>
			</div>
		</ScoreProvider>
	);
};

export default Game;
