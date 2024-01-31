import {
	GameOutcome,
	cancelMatchmaking,
	gameFinished,
} from '../GlobalRedux/features';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import useStartGame from '../hooks/useStartGame';
import Link from 'next/link';
import { RootState } from '../GlobalRedux/store';
import { useAppContext } from '@/app/AppContext';

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
	const { pushToGame } = useStartGame();
	const context = useAppContext();
	const dispatch = useDispatch();

	useEffect(() => {
		context.socket?.on('gameStopped', () => {
			modalRef.current?.showModal();
			dispatch(gameFinished());
		});
	});

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
								<button onClick={() => pushToGame()} className="btn">
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
