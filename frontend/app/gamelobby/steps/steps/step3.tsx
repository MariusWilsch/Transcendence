'use client';
import {
	Carousel,
	CarouselNavigation,
	Modal,
} from '@/app/gamelobby/components';
import useStartGame from '@/app/gamelobby/hooks/useStartGame';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/gamelobby/GlobalRedux/store';

// Step3.tsx
export const Step3 = () => {
	//! Instead of sending the setMapChoice everytime only send it once when the game starts
	const { pushGame } = useStartGame();
	const isConnected = useSelector(
		(state: RootState) => state.connection.isConnected,
	);

	return (
		<>
			<Carousel />
			<CarouselNavigation />
			<button
				className="btn btn-accent mt-8"
				onClick={() => pushGame(isConnected)}
			>
				START A GAME
			</button>
			<Modal />
		</>
	);
};
