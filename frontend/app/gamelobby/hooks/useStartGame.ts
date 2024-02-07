'use client';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../GlobalRedux/store';
import { useEffect } from 'react';
import {
	ConnectionStatus,
	Invite,
	MatchmakingStatus,
	acceptPrivate,
	addToLobby,
	aiDifficulty,
	invitePrivate,
	startConnection,
} from '../GlobalRedux/features';

const useStartGame = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { isConnected, isInMatchmaking, isGameStarted } = useSelector(
		(state: RootState) => state.connection,
	);
	const gameConfig = useSelector((state: RootState) => state.gameConfig);

	function initCanvasSize() {
		let size = [window.innerWidth / 2, window.innerHeight / 2];
		const ratio = 16 / 9;

		let w, h;

		if (size[0] / size[1] >= ratio) {
			w = size[1] * ratio;
			h = size[1];
		} else {
			w = size[0];
			h = size[0] / ratio;
		}
		return { width: w, height: h };
	}

	const pushGame = (isConnected: ConnectionStatus) => {
		if (isConnected === ConnectionStatus.DISCONNECTED)
			dispatch(startConnection());
		if (
			isInMatchmaking === MatchmakingStatus.DUPLICATE ||
			isInMatchmaking === MatchmakingStatus.SEARCHING
		)
			return;
		if (isConnected === ConnectionStatus.CONNECTED)
			dispatch(addToLobby(initCanvasSize()));
		if (gameConfig.aiDifficulty !== aiDifficulty.NONE) dispatch(addToLobby());
	};

	const handleInvite = (
		inviteeID: string | undefined,
		connectionStatus: ConnectionStatus,
		invite: Invite,
	) => {
		if (connectionStatus === ConnectionStatus.DISCONNECTED)
			dispatch(startConnection());
		invite === Invite.INVITING
			? dispatch(invitePrivate({ inviteeID }))
			: dispatch(acceptPrivate({ inviteeID }));
	};

	useEffect(() => {
		const showModal = () => {
			if (typeof document !== 'undefined') {
				const modal = document.getElementById(
					'startMatchmakingModal',
				) as HTMLDialogElement;
				modal?.showModal();
			}
		};

		const closeModal = () => {
			if (typeof document !== 'undefined') {
				if (isInMatchmaking === MatchmakingStatus.SEARCHING) return null;
				const modal = document.getElementById(
					'startMatchmakingModal',
				) as HTMLDialogElement;
				modal?.close();
			}
		};
		if (isGameStarted) {
			closeModal();
			router.push(`/gamelobby/game`, { scroll: false });
		} else if (
			isConnected === ConnectionStatus.CONNECTED &&
			isInMatchmaking === MatchmakingStatus.SEARCHING
		) {
			showModal();
		}
	}, [isGameStarted, isConnected, isInMatchmaking, router]);

	return {
		pushGame,
		handleInvite,
	};
};

export default useStartGame;
