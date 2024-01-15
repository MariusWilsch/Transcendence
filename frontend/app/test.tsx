import GameCanvas from './game/GameCanvas';
import Cards from './components/Cards';
import Steps from './components/Steps';
import { Stats } from './game/GameCanvas';
import { createContext, useState, useContext } from 'react';

const ScoreContext = createContext({
	//! Stopped here
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
			value={{
				player1Score,
				player2Score,
				setPlayer1Score,
				setPlayer2Score,
			}}
		>
			{children}
		</ScoreContext.Provider>
	);
};

export const Sidebar = () => {
	return (
		<div className="w-[5vw] bg-base-200 flex flex-col items-center justify-center space-y-[50%] flex-shrink-0">
			<div className="w-8 h-8 bg-gray-300 absolute top-4"></div>{' '}
			{/* Logo placeholder */}
			<div className="w-6 h-6 bg-gray-300"></div>{' '}
			{/* Icon placeholder - I need to add percentage based width's as soon as I have the icon's */}
			<div className="w-6 h-6 bg-gray-300"></div> {/* Icon placeholder */}
			<div className="w-6 h-6 bg-gray-300"></div> {/* Icon placeholder */}
			<div className="w-6 h-6 bg-gray-300"></div> {/* Icon placeholder */}
			<div className="w-6 h-6 bg-gray-300"></div> {/* Icon placeholder */}
		</div>
	);
};

const NavBar = () => {
	return <div className="h-[8vh] bg-base-200 "></div>;
};

const GamePage = () => {
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

const GameCanvasWrapper = () => {
	return (
		<div className="h-3/4 flex items-center justify-center">
			<GameCanvas />
		</div>
	);
};

const GameHeader = () => {
	return (
		<div className="h-1/4 flex items-center justify-evenly">
			<Stats scorePos={'left'} />
			<Stats scorePos={'right'} />
		</div>
	);
};

const Content = () => {
	return (
		<div className="flex flex-1 flex-col  justify-center -mt-1 -ml-1 rounded-tl-2xl bg-base-100 h-full">
			<Cards />
			{/* <Steps /> */}
			{/* <Matchmaking /> //! Proberably not gonna used that */}
			{/* <GamePage /> */}
		</div>
	);
};

const Test = () => {
	return (
		<div className="flex flex-col h-screen w-screen">
			<div className="flex flex-1">
				<Sidebar />
				<div className="flex flex-col w-full h-full">
					<NavBar />
					<Content />
				</div>
			</div>
		</div>
	);
};

export default Test;
