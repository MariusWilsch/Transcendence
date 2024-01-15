'use client';
import { createContext, useState, useContext } from 'react';

// Create the context with a default value
const ScoreContext = createContext({
	player1Score: 0,
	player2Score: 0,
	setPlayer1Score: (score: number) => {},
	setPlayer2Score: (score: number) => {},
});

export const useScore = () => useContext(ScoreContext);

export const ScoreProvider = ({ children }: any) => {
	const [player1Score, setPlayer1Score] = useState(0);
	const [player2Score, setPlayer2Score] = useState(0);

	return (
		<ScoreContext.Provider
			value={{ player1Score, player2Score, setPlayer1Score, setPlayer2Score }}
		>
			{children}
		</ScoreContext.Provider>
	);
};
