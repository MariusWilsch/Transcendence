'use client';
import { createContext, useState, useContext } from 'react';

interface GameContextProps {
	//* Score Context
	player1Score: number;
	player2Score: number;
	setPlayer1Score: (score: number) => void;
	setPlayer2Score: (score: number) => void;
	//* Game Context
	twoPlayersFound: boolean;
	setTwoPlayersFound: (found: boolean) => void;
}

// Create the context with a default value
// const ScoreContext = createContext({
// 	player1Score: 0,
// 	player2Score: 0,
// 	setPlayer1Score: (score: number) => {},
// 	setPlayer2Score: (score: number) => {},
// });

// Create the context with a default value
export const GameContext = createContext<GameContextProps>({
	player1Score: 0,
	player2Score: 0,
	setPlayer1Score: (score: number) => {},
	setPlayer2Score: (score: number) => {},
	twoPlayersFound: false,
	setTwoPlayersFound: (found: boolean) => {},
});

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }: any) => {
	const [player1Score, setPlayer1Score] = useState(0);
	const [player2Score, setPlayer2Score] = useState(0);
	const [twoPlayersFound, setTwoPlayersFound] = useState(false);

	return (
		<GameContext.Provider
			value={{
				player1Score,
				player2Score,
				setPlayer1Score,
				setPlayer2Score,
				twoPlayersFound,
				setTwoPlayersFound,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};
