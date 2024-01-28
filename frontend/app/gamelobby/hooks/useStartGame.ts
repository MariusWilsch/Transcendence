'use client';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../GlobalRedux/store';
import { useEffect } from 'react';
import {
	ConnectionStatus,
	MatchmakingStatus,
	addToLobby,
	aiDifficulty,
	setConnectionStatus,
	setMatchmaking,
	setupAIMatch,
	startConnection,
} from '../GlobalRedux/features';
import { MatchType } from '@/interfaces';

const useStartGame = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const connection = useSelector((state: RootState) => state.connection);
	const gameConfig = useSelector((state: RootState) => state.gameConfig);
	//! Modal shouldn't be fetched by using getElementById

	//* Connect user to socket server and start matchmaking
	const initSocketPushGame = (matchType: MatchType, inviteeID?: string) => {
		dispatch(startConnection());
		dispatch(setMatchmaking(MatchmakingStatus.SEARCHING));

		gameConfig.aiDifficulty !== aiDifficulty.NONE
			? handleAIMatch()
			: dispatch(addToLobby({ matchType: 0 }));
	};

	//* User is connected to socket server and start matchmaking

	const pushToGame = (matchType: MatchType) => {
		dispatch(addToLobby({ matchType }));
		dispatch(setMatchmaking(MatchmakingStatus.SEARCHING));
		// showModal();
	};

	const showModal = () => {
		const modal = document.getElementById(
			'startMatchmakingModal',
		) as HTMLDialogElement;
		modal?.showModal();
	};

	const closeModal = () => {
		if (connection.isInMatchmaking === MatchmakingStatus.SEARCHING) return null;
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
		if (connection.isGameStarted) {
			closeModal();
			router.push(`${process.env.NEXT_PUBLIC_API_URL}:3000/gamelobby/game`);
		}
		return () => {
			closeModal();
		};
	}, [connection.isGameStarted, router]);

	useEffect(() => {
		if (
			connection.isConnected === ConnectionStatus.CONNECTED &&
			!connection.isGameStarted &&
			connection.isInMatchmaking === MatchmakingStatus.SEARCHING
		) {
			showModal();
		}
	}),
		[connection.isConnected, connection.isGameStarted];

	return {
		initSocketPushGame,
		pushToGame,
	};
};

export default useStartGame;
