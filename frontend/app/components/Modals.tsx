import { cancelMatchmaking } from '../GlobalRedux/features';
import { useDispatch } from 'react-redux';

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
					Click outside of the modal or click the button to cancel the
					matchmaking.
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
