'use client';
import { GameCanvas } from './GameCanvas';
import { RootState } from '@/app/gamelobby/GlobalRedux/store';
import {
	setupInteraction,
	startLoop,
} from '@/app/gamelobby/GlobalRedux/features';
import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GameOutcomeModal } from '@/app/gamelobby/components';
import Image from 'next/image';

interface ScoreProps {
	score: number;
	username: string;
}

const Score: React.FC<ScoreProps> = ({ score, username }) => {
	return (
		<div className="flex flex-col">
			<div className="text-2xl font-bold"> {username} </div>
			<div className="text-xl">{score}</div>
		</div>
	);
};

interface StatsProps {
	scorePos: 'left' | 'right';
	gameData: {
		username: string;
		avatar: string;
	};
}

const Stats: React.FC<StatsProps> = ({ scorePos, gameData }: any) => {
	const score = useSelector((state: RootState) => state.game.score);

	console.log(gameData);

	return (
		<div className="flex items-center gap-x-8">
			{scorePos === 'right' ? (
				<Score score={score.player1} username={gameData.username} />
			) : null}
			<div className="avatar">
				<Image
					src={gameData.avatar}
					alt={'Some text here'}
					width={100}
					height={100}
				/>
			</div>
			{scorePos === 'left' ? (
				<Score score={score.player2} username={gameData.username} />
			) : null}
		</div>
	);
};

function CountdownModal() {
	const modalRef = useRef<HTMLDialogElement>(null);
	const countdownRef = useRef<HTMLSpanElement>(null);
	const isGameStarted = useSelector(
		(state: RootState) => state.connection.isGameStarted,
	);
	const gameConfig = useSelector((state: RootState) => state.gameConfig);
	const dispatch = useDispatch();

	useEffect(() => {
		if (isGameStarted) {
			countDown();
		}
	}, [isGameStarted]);

	const countDown = () => {
		const modal = modalRef.current;
		const countdown = countdownRef.current;
		let remainingTime = 5;

		dispatch(setupInteraction(gameConfig));
		if (modal && countdown) {
			modal.showModal();
			const interval = setInterval(() => {
				remainingTime--;
				countdown.style.setProperty('--value', remainingTime.toString());
				if (remainingTime <= 0) {
					dispatch(startLoop());
					modal.close();
					clearInterval(interval);
				}
			}, 1000);
		}
	};

	return (
		<dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
			<div className="modal-box flex justify-center">
				<div className="py-4">
					Game starting in{' '}
					<span className="countdown">
						<span
							ref={countdownRef}
							style={{ '--value': 5 } as React.CSSProperties}
						></span>
					</span>
				</div>
			</div>
		</dialog>
	);
}

const GameHeader = () => {
	const userData = useSelector((state: RootState) => state.game.userData);
	//! this is not gonna show the right avatar gameData will be the same for both

	console.log(userData);

	return (
		<div className="h-1/4 flex items-center justify-evenly">
			<Stats scorePos={'left'} gameData={userData[0]} />
			<Stats scorePos={'right'} gameData={userData[1]} />
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

export default function Game() {
	const playerOutcome = useSelector(
		(state: RootState) => state.connection.playerOutcome,
	);

	return (
		<>
			<CountdownModal />
			<GameOutcomeModal outcome={playerOutcome} />
			<div className="flex flex-col items-center h-full">
				<div className="flex flex-col w-3/5 h-full py-8">
					<GameHeader />
					<GameCanvasWrapper />
				</div>
			</div>
		</>
	);
}
