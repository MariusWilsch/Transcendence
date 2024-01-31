'use client';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../GlobalRedux/store';
import { useEffect } from 'react';
import {
	ConnectionStatus,
	InputType,
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

	//* Connect user to socket server and start matchmaking
	const initSocketPushGame = () => {
		console.log('initSocketPushGame');
		dispatch(startConnection());
		dispatch(addToLobby());
		gameConfig.aiDifficulty !== aiDifficulty.NONE
			? handleAIMatch()
			: dispatch(setMatchmaking(MatchmakingStatus.SEARCHING));
	};

	//* User is connected to socket server and start matchmaking

	const pushToGame = () => {
		console.log('pushToGame');
		dispatch(addToLobby());
		gameConfig.aiDifficulty !== aiDifficulty.NONE
			? handleAIMatch()
			: dispatch(setMatchmaking(MatchmakingStatus.SEARCHING));
	};

	//* Simplifed version of the above two functions
	const pushGame = (isConnected: ConnectionStatus) => {
		if (isConnected === ConnectionStatus.DISCONNECTED)
			dispatch(startConnection());
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

	const handleAIMatch = () => {};

	//* This useEffect hook will redirect the user to the game page
	//* if the isGameStarted state is true
	useEffect(() => {
		if (isGameStarted) {
			closeModal();
			router.push(`/gamelobby/game`);
		}
		return () => {};
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

	return {
		initSocketPushGame,
		pushToGame,
		pushGame,
		handleInvite,
	};
};

export default useStartGame;
