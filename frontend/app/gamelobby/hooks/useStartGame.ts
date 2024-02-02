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
	setMatchmaking,
	startConnection,
} from '../GlobalRedux/features';

const useStartGame = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { isConnected, isInMatchmaking, isGameStarted } = useSelector(
		(state: RootState) => state.connection,
	);
	const gameConfig = useSelector((state: RootState) => state.gameConfig);
	//! Modal shouldn't be fetched by using getElementById

	const pushGame = (isConnected: ConnectionStatus) => {
		if (isConnected === ConnectionStatus.DISCONNECTED)
			dispatch(startConnection());
		if (isInMatchmaking === MatchmakingStatus.DUPLICATE) return;
		dispatch(addToLobby());
		gameConfig.aiDifficulty !== aiDifficulty.NONE
			? dispatch(addToLobby())
			: dispatch(setMatchmaking(MatchmakingStatus.SEARCHING));
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
			router.push(`/gamelobby/game`);
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
