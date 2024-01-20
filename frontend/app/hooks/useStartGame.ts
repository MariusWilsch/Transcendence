'use client';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../GlobalRedux/store';
import { useEffect } from 'react';
import {
	ConnectionStatus,
	MatchmakingStatus,
	addToLobby,
	setConnectionStatus,
	setMatchmaking,
	startConnection,
} from '../GlobalRedux/features';

const useStartGame = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const push = useSelector(
		(state: RootState) => state.connection.isGameStarted,
	);
	const isInMatchmaking = useSelector(
		(state: RootState) => state.connection.isInMatchmaking,
	);
	//! Modal shouldn't be fetched by using getElementById

	//* Connect user to socket server
	const initSocketPushGame = () => {
		const modal = document.getElementById(
			'startMatchmakingModal',
		) as HTMLDialogElement;
		modal?.showModal();
		dispatch(startConnection());
		dispatch(setConnectionStatus(ConnectionStatus.CONNECTED));
	};

	const pushToGame = () => {
		const modal = document.getElementById(
			'startMatchmakingModal',
		) as HTMLDialogElement;
		modal?.showModal();
		if (isInMatchmaking === MatchmakingStatus.SEARCHING) return null;
		dispatch(setMatchmaking(MatchmakingStatus.SEARCHING));
		dispatch(addToLobby());
	};

	//* This useEffect hook will redirect the user to the game page
	//* if the isGameStarted state is true
	useEffect(() => {
		if (push) router.push('/game');
	}, [push, router]);

	return { handleStartGame: initSocketPushGame, handlePushToGame: pushToGame };
};

export default useStartGame;
