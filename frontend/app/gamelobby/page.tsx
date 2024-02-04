'use client';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from '../AppContext';
import Cards from './components/Cards';
import { useEffect } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useStartGame from './hooks/useStartGame';
import { useSelector } from 'react-redux';
import { RootState } from './GlobalRedux/store';
import { Invite } from '@/app/gamelobby/GlobalRedux/features';

export default function Home() {
	const context = useAppContext();
	const { handleInvite } = useStartGame();
	const isConnected = useSelector(
		(state: RootState) => state.connection.isConnected,
	);

	useEffect(() => {
		if (!context.socket || !context.user) return;
		context.socket?.on('privateMatch', (data: any) => {
			const msg = 'invitation from ' + data.from.login + ' for a game';
			toast((t) => (
				<div className="flex flex-row rounded-lg bg-slate-500 bg-opacity-80">
					<div className='w-[60%]'> {msg} </div>
					<button
						className="w-[20%] flex items-center justify-center text-sm font-medium text-indigo-600  hover:text-indigo-500 "
						onClick={() => {
							console.log('accept handler');
							toast.dismiss(t.id);
							if (context.user)
							{
								handleInvite(context.user.intraId, isConnected, Invite.ACCEPTING);
							}
						}}
					>
						<FiCheckCircle size="30" className="text-green-300" />
					</button>
					<button
						className="w-[20%] border border-transparent rounded-none rounded-r-lg p-3 flex items-center justify-center text-sm font-medium"
						onClick={() => {
							toast.dismiss(t.id);
							console.log('dismiss handler');
						}}
					>
						<FiXCircle size="30" className="text-red-300" />
					</button>
				</div>
			));
			console.log('the private chat event has been occured');
		});
		return () => {
			toast.dismiss();
			if (context.socket) context.socket.off('privateMatch');
		};
	}, [context.user]);

	return (
		<div className="text-white">
			<Cards />
			<Toaster />
		</div>
	);
}
