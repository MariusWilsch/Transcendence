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
	setPrivateMatch,
	startConnection,
} from '../GlobalRedux/features';

const useStartGame = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const { isConnected, isInMatchmaking, isGameStarted } = useSelector(
		(state: RootState) => state.connection,
	);
	const gameConfig = useSelector((state: RootState) => state.gameConfig);

	const pushGame = (isConnected: ConnectionStatus) => {
		if (isConnected === ConnectionStatus.DISCONNECTED)
			dispatch(startConnection());
		if (
			isInMatchmaking === MatchmakingStatus.DUPLICATE ||
			isInMatchmaking === MatchmakingStatus.SEARCHING
		)
			return;
		if (isConnected === ConnectionStatus.CONNECTED)
			dispatch(addToLobby(gameConfig.aiDifficulty));
		if (gameConfig.aiDifficulty !== aiDifficulty.NONE)
			dispatch(addToLobby(gameConfig.aiDifficulty));
	};

	const handleInvite = (
		inviteeID: string | undefined ,
		connectionStatus: ConnectionStatus,
		invite: Invite,
	) => {
		if (inviteeID === undefined) return;
		dispatch(setPrivateMatch(true));
		if (connectionStatus === ConnectionStatus.DISCONNECTED)
			dispatch(startConnection());
		switch (invite) {
			case Invite.INVITING:
				dispatch(invitePrivate({ inviteeID }));
				break;
			case Invite.ACCEPTING:
				dispatch(acceptPrivate({ inviteeID }));
				break;
			case Invite.REJECTING:
				dispatch(acceptPrivate({ inviteeID, accepted: false }));
				break;
			default:
				break;
		}
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
