'use client';
import { Carousel, CarouselNavigation, Modal } from '@/app/components';
import useStartGame from '@/app/hooks/useStartGame';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/GlobalRedux/store';
import { ConnectionStatus } from '@/app/GlobalRedux/features';

// Step3.tsx
export const Step3 = () => {
	//! Instead of sending the setMapChoice everytime only send it once when the game starts
	const { handleStartGame, handlePushToGame } = useStartGame();
	const isConnected = useSelector(
		(state: RootState) => state.connection.isConnected,
	);

	return (
		<>
			<Carousel />
			<CarouselNavigation />
			<button
				className="btn btn-accent mt-8"
				onClick={
					isConnected === ConnectionStatus.CONNECTED
						? handlePushToGame
						: handleStartGame
				}
			>
				START A GAME
			</button>
			<Modal />
		</>
	);
};
