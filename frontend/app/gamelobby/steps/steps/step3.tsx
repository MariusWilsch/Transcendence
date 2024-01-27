'use client';
import {
	Carousel,
	CarouselNavigation,
	Modal,
} from '@/app/gamelobby/components';
import useStartGame from '@/app/gamelobby/hooks/useStartGame';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/gamelobby/GlobalRedux/store';
import { ConnectionStatus } from '@/app/gamelobby/GlobalRedux/features';
import { MatchType } from '@/interfaces';

// Step3.tsx
export const Step3 = () => {
	//! Instead of sending the setMapChoice everytime only send it once when the game starts
	const { initSocketPushGame, pushToGame } = useStartGame();
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
						? () => {
								initSocketPushGame(MatchType.PUBLIC);
						  }
						: () => {
								pushToGame(MatchType.PRIVATE);
						  }
				}
			>
				START A GAME
			</button>
			<Modal />
		</>
	);
};
