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
	setupAIMatch,
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

	//* Connect user to socket server and start matchmaking
	const initSocketPushGame = () => {
		dispatch(startConnection());
		dispatch(setMatchmaking(MatchmakingStatus.SEARCHING));

		gameConfig.aiDifficulty !== aiDifficulty.NONE
			? handleAIMatch()
			: dispatch(addToLobby());
	};

	//* User is connected to socket server and start matchmaking

	const pushToGame = () => {
		dispatch(addToLobby());
		dispatch(setMatchmaking(MatchmakingStatus.SEARCHING));
	};

	const handleInvite = (
		inviteeID: string,
		connectionStatus: ConnectionStatus,
		invite: Invite,
	) => {
		if (connectionStatus === ConnectionStatus.DISCONNECTED)
			dispatch(startConnection());
		invite === Invite.INVITING
			? dispatch(invitePrivate({ inviteeID }))
			: dispatch(acceptPrivate({ inviteeID }));
	};

	const showModal = () => {
		const modal = document.getElementById(
			'startMatchmakingModal',
		) as HTMLDialogElement;
		modal?.showModal();
	};

	const closeModal = () => {
		if (isInMatchmaking === MatchmakingStatus.SEARCHING) return null;
		const modal = document.getElementById(
			'startMatchmakingModal',
		) as HTMLDialogElement;
		modal?.close();
	};

	const handleAIMatch = () => {
		dispatch(setupAIMatch(gameConfig));
	};

	//* This useEffect hook will redirect the user to the game page
	//* if the isGameStarted state is true
	useEffect(() => {
		if (isGameStarted) {
			closeModal();
			router.push(`${process.env.NEXT_PUBLIC_API_URL}:3000/gamelobby/game`);
		}
	}, [isGameStarted, router]);

	useEffect(() => {
		if (
			isConnected === ConnectionStatus.CONNECTED &&
			isInMatchmaking === MatchmakingStatus.SEARCHING
		) {
			showModal();
		} else if (isInMatchmaking === MatchmakingStatus.DUPLICATE) {
			alert('You are already connected on another tab');
			//? How can I make react-toastify work here?
		}
	}, [isConnected, isInMatchmaking]);

	// useEffect(() => {
	// 	if (
	// 		connection.isConnected === ConnectionStatus.CONNECTED &&
	// 		!connection.isGameStarted &&
	// 		connection.isInMatchmaking === MatchmakingStatus.SEARCHING
	// 	) {
	// 		showModal();
	// 	}
	// }),
	// 	[connection.isConnected, connection.isGameStarted];

	return {
		initSocketPushGame,
		pushToGame,
		handleInvite,
	};
};

export default useStartGame;
