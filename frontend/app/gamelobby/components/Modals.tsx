'use client';
import {
	ConnectionStatus,
	GameOutcome,
	cancelMatchmaking,
	disconnect,
	startLoop,
	setCountDownDone,
	setupInteraction,
	aiDifficulty,
	InputType,
} from '@/app/gamelobby/GlobalRedux/features';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import useStartGame from '../hooks/useStartGame';
import Link from 'next/link';
import { RootState } from '../GlobalRedux/store';

export const Modal = () => {
	const dispatch = useDispatch();

	return (
		<dialog id="startMatchmakingModal" className="modal">
			<div className="modal-box text-left">
				<h3 className="font-bold text-lg flex items-end">
					Searching for a game{' '}
					<span className="ml-2 loading loading-dots loading-md"></span>
				</h3>
				<p className="py-4">
					Click outside of the modal or click the button to cancel the matchmaking.
				</p>
				<div className="modal-action">
					<form onClick={() => dispatch(cancelMatchmaking())} method="dialog">
						<button className="btn btn-wide">Cancel Matchmaking</button>
					</form>
				</div>
			</div>
			<form
				onClick={() => dispatch(cancelMatchmaking())}
				method="dialog"
				className="modal-backdrop"
			>
				<button>close</button>
			</form>
		</dialog>
	);
};

export function GameOutcomeModal({ outcome }: any) {
	const modalRef = useRef<HTMLDialogElement>(null);
	const isGameStarted = useSelector(
		(state: RootState) => state.connection.isGameStarted,
	);
	const { pushGame } = useStartGame();

	useEffect(() => {
		if (!isGameStarted) {
			modalRef.current?.showModal();
		}
	}, [isGameStarted]);

	return (
		<>
			<Modal />
			<dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
				<div className="modal-box flex flex-col justify-center items-center ">
					{outcome === GameOutcome.NONE ? (
						<div className="font-bold text-lg">Something went Wrong!</div>
					) : (
						<div className="font-bold text-lg">You {outcome}</div>
					)}
					<div className="modal-action flex justify-center items-center">
						<form method="dialog" className="space-x-4 w-full flex justify-center">
							{outcome !== GameOutcome.NONE && (
								<button
									onClick={() => pushGame(ConnectionStatus.CONNECTED)}
									className="btn"
								>
									Play again
								</button>
							)}
							<Link href={`/gamelobby`}>
								<button className="btn">Go Home</button>
							</Link>
						</form>
					</div>
				</div>
			</dialog>
		</>
	);
}

export function CountdownModal() {
	const modalRef = useRef<HTMLDialogElement>(null);
	const countdownRef = useRef<HTMLSpanElement>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const isGameStarted = useSelector(
		(state: RootState) => state.connection.isGameStarted,
	);
	const gameConfig = useSelector((state: RootState) => state.gameConfig);
	const dispatch = useDispatch();

	useEffect(() => {
		if (isGameStarted) {
			countDown();
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current!);
		};
	}, [isGameStarted]);

	useEffect(() => {
		const handleBackButton = () => {
			console.log('Back button pressed');
			dispatch(disconnect());
		};
		window.addEventListener('popstate', handleBackButton);
		return () => {
			window.removeEventListener('popstate', handleBackButton);
		};
	});

	const countDown = () => {
		const modal = modalRef.current;
		const countdown = countdownRef.current;
		let remainingTime = 5;

		dispatch(setupInteraction(gameConfig));
		if (gameConfig.aiDifficulty !== aiDifficulty.NONE)
			dispatch(setupInteraction({ ...gameConfig, inputType: InputType.AI }));

		if (modal && countdown) {
			modal.showModal();
			intervalRef.current = setInterval(() => {
				remainingTime--;
				countdown.style.setProperty('--value', remainingTime.toString());
				if (remainingTime <= 0) {
					dispatch(startLoop());
					modal.close();
					clearInterval(intervalRef.current!);
					dispatch(setCountDownDone(true));
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
