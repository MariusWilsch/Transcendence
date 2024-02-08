'use client';
// import '@mantine/core/styles.css';
import { Channel, User, useAppContext } from '@/app/AppContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { GrGroup } from 'react-icons/gr';
import JoinProtectedChannel from '../chatComponents/JoinProtectedChannel';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Loading } from '../components/Loading';
import CreateChannelModal from '../chatComponents/CreateChannel';
import { getCurrentUser } from '../utiles/utiles';

async function inviteHandler(Channelname: string, status: boolean, user: User) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/updateChannelInvite/${user.intraId}/${Channelname}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({
					status: `${status}`,
				}),
			},
		);
		const res = await response.json();
		if (response.ok) {
			if (status===true) {
				toast.success('you successfully joined the channel');
			} else {
				toast.success('invitation is declained');
			}
		} else {
			const msg = 'Error: ' + res.error();
			;
			toast.error(msg);
		}
	} catch (e) {
		const msg = 'Error' + e;
		toast.error(msg);
	}
}

const ChannelsLobby = () => {
	const context = useAppContext();
	const [availabelChannels, setAvailableChannels] = useState<Channel[] | []>([]);
	const [invitationChannels, setInvitationChannels] = useState<Channel[] | []>(
		[],
	);
	const [channels, setUserChannels] = useState<Channel[]>([]); // Provide a type for the messages stat
	const [inputValue, setInputValue] = useState('');
	const [selectedFeild, setselectedFeild] = useState('');
	const [isLoading, setIsLoading] = useState(false); 

	useEffect(() => {
		const checkJwtCookie = async () => {
			try {
				if (!context.user)
				{
					const user = await getCurrentUser();
					if (!user || user ===undefined)
					{
						return;
					}
					context.setUser(user);
				}
					} catch (error: any) {
				const msg = 'Error during login' + error.message;
				toast.error(msg);
				console.error('Error during login:', error);
			}
		};
		checkJwtCookie();
	}, [context.user]);

	useEffect(() => {
		const fetchChannels = async()=>{

			if (inputValue) {
				exploreChannelsQuery(inputValue);
			}
		}
		fetchChannels();
	}, [inputValue]);

	useEffect(()=>{
		if (selectedFeild ==='' && !isLoading && context.user){
			setselectedFeild('my channels');
			userChannels();
		}
	},[channels, context.user])
	useEffect(()=>{
		const fetchUserChannels=async()=>{
			if (selectedFeild === 'my channels')
			{
				userChannels();
			}
			else if (selectedFeild === 'Explore')
			{
				exploreChannels();
			}
			else if (selectedFeild === 'Invitations')
			{
				inviteChannels();
			}
		}
		fetchUserChannels();
	}, [selectedFeild, context.trigger]);
	const userChannels = async () => {
		if (!context.user) {
			return;
		}
		try {
			setIsLoading(true);
			const response: any = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/channels/${context.user?.intraId}/userChannels`,
				{
					method: 'GET',
					credentials: 'include',
				},
			);
			const data = await response.json();
			if (!data) {
				const msg = 'Error getting channels';
				toast.error(msg);
			}
			if (data) {
				setUserChannels(data);
				setIsLoading(false);
			}
		} catch (error: any) {
			const msg = 'Error getting friends: ' + error.message;
			toast.error(msg);
			setIsLoading(false);
		}
	};
	const exploreChannels = async () => {
		if (!context.user) {
			return;
		}
		try {
			setIsLoading(true);
			const response: any = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/channels/${context.user.intraId}/availabelChannels`,
				{
					method: 'GET',
					credentials: 'include',
				},
			);
			const data = await response.json();
			if (!data) {
				const msg = 'Error getting channels';
				toast.error(msg);
			}
			if (data) {
				setAvailableChannels(data);
				setIsLoading(false);
			}
		} catch (error: any) {
			const msg = 'Error getting channels: ' + error.message;
			toast.error(msg);
			setIsLoading(false);
		}
	};
	const exploreChannelsQuery = async (query:string) => {
		if (!context.user) {
			return;
		}
		try {
			const response: any = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/channels/${context.user.intraId}/availChan?q=${query}`,
				{
					method: 'GET',
					credentials: 'include',
				},
			);
			const data = await response.json();
			if (!data) {
				const msg = 'Error getting channels';
				toast.error(msg);
			}
			if (data) {
				setAvailableChannels(data);
			}
		} catch (error: any) {
			const msg = 'Error getting channels: ' + error.message;
			toast.error(msg);
		}
	};

	const inviteChannels = async () => {
		if (!context.user) {
			return;
		}
		try {
			const response: any = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/channelInvitation/${context.user.intraId}`,
				{
					method: 'GET',
					credentials: 'include',
				},
			);
			const data = await response.json();
			if (!data) {
				const msg = 'Error getting channels';
				toast.error(msg);
			}
			if (data) {
				setInvitationChannels(data);
			}
		} catch (error: any) {
			const msg = 'Error getting channels: ' + error.message;
			toast.error(msg);
		}
	};
	if (isLoading)
	{
		return <Loading />
	}
	return (
		// <MantineProvider>
		<div className="custom-height z-20 w-screen bg-[#12141A]">
			<div className="flex ">
				<div className="flex-1 overflow-y-auto">
					<div className="p-10">
						<div className="">
							<div className="mb-5 text-white font-sans">Channels </div>
							<div className="border-b border-gray-500 my-4 mb-10"></div>
							<div className="flex justify-center mb-8">
								<div className="flex flex-row justify-between md:w-[50vw] w-full  bg-gray-600 rounded-md mb-4">
									<button
										className="w-full"
										onClick={ () => {
											setselectedFeild('my channels');
										}}
									>
										<div
											className={`${
												selectedFeild === 'my channels'
													? 'underline underline-offset-8 text-slate-200'
													: 'text-slate-300'
											} font-sans p-3 hover:bg-gray-500 rounded-md w-full`}
										>
											My channels
										</div>
									</button>
									<button
										className="w-full"
										onClick={() => {
											setselectedFeild('Explore');
										}}
									>
										<div
											className={`${
												selectedFeild === 'Explore'
													? 'underline underline-offset-8 text-slate-200'
													: 'text-slate-300'
											} font-sans p-3 hover:bg-gray-500 rounded-md w-full`}
										>
											Explore
										</div>
									</button>
									<button
										className="w-full"
										onClick={() => {
											setselectedFeild('Invitations');
										}}
									>
										<div
											className={`${
												selectedFeild === 'Invitations'
													? 'underline underline-offset-8 text-slate-200'
													: 'text-slate-300'
											} font-sans p-3 hover:bg-gray-500 rounded-md w-full`}
										>
											Invitations
										</div>
									</button>
								</div>
							</div>
							{selectedFeild === 'Explore' && (
									<div className="w-full flex items-center justify-center mb-6">
										<div className="md:w-[50vw] w-full flex items-center justify-center">
											<div className="md:w-[50vw] w-full flex flex-row-reverse">
												<label className=" flex flex-grow ">
													<input
														id="searchField"
														name={`inputValue${Math.random()}`}
														type="text"
														value={inputValue}
														placeholder="Search ..."
														onChange={(e) => {
															setInputValue(e.target.value);
														}}
														className="min-w-[80vw] md:min-w-[50vw] bg-[#1E2028] items-center justify-center p-2 rounded-lg border-opacity-40 border-2 border-slate-300  text-sm outline-none text-white"
													/>
													<div className="md:hidden">&nbsp; &nbsp;</div>
												</label>
											</div>
										</div>
									</div>
							)}

							<motion.div
								initial={{ opacity: 0, y: -100 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.02 }}
							>
								<div className="mt-4 flex  justify-center ">
									<div className=" w-full flex flex-col items-center">
										{selectedFeild === 'my channels' && (
											<div>
												<CreateChannelModal  />{' '}
											</div>
										)}
										{isLoading && <div>loading........</div>}
										{availabelChannels &&
											selectedFeild === 'Explore' &&
											availabelChannels.map((channel: Channel) => (
												<div
													key={channel.name}
													className=" p-2 mb-2 min-w-[80vw] md:min-w-[50vw] items-center justify-center "
												>
														<div className="max-w-md w-full min-w-full bg-[#1E2028] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
															<div className="flex-1 w-0 p-4">
																<div className="flex items-center">
																	<div className="relative flex-shrink-0 pt-0.5">
																		<GrGroup className="h-10 w-10" />
																	</div>

																	<div className="ml-3 f">
																		<p className="text-md font-sans text-white  text-center">
																			{channel.name}
																		</p>
																	</div>
																</div>
															</div>
															<div className="flex justify-center items-center border-l border-gray-900">
																<JoinProtectedChannel selectedChannel={channel} />
															</div>
														</div>
												</div>
											))}
											{isLoading && <div>loading........</div>}
										{channels &&
											selectedFeild === 'my channels' &&
											channels?.map((channel: any) => (
												<div
													key={channel.channelId}
													className=" p-2 mb-2 min-w-[80vw] md:min-w-[50vw] items-center justify-center "
												>
													<motion.div
														whileTap={{ scale: 0.9 }}
														whileHover={{ scale: 1.1 }}
														initial={{ opacity: 0, y: -100 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: 0.02 }}
													>
														<Link
															href={`${process.env.NEXT_PUBLIC_API_URL}:3000/channels/${channel.channelId}`}
															onClick={() => {
																context.setComponent('conversation');
															}}
														>
															<div className="max-w-md w-full min-w-full bg-[#1E2028] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
																<div className="flex-1 w-0 p-4">
																	<div className="flex items-center">
																		<div className="relative flex-shrink-0 pt-0.5">
																			<GrGroup className="h-10 w-10" />
																		</div>

																		<div className="ml-3 flex flex-col items-center">
																			<p className="text-md font-sans text-white ">
																				{channel.channelName}
																			</p>
																		</div>
																	</div>
																</div>
															</div>
														</Link>
													</motion.div>
												</div>
											))}
											{isLoading && <div>loading........</div>}
										{invitationChannels &&
											selectedFeild === 'Invitations' &&
											invitationChannels?.map((channel: any) => (
												<div
													key={channel.channelId}
													className=" p-2 mb-2 min-w-[80vw] md:min-w-[50vw] items-center justify-center "
												>
														<div>
															<div className="max-w-md w-full min-w-full bg-[#1E2028] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
																<div className="flex-1 w-0 p-4">
																	<div className="flex items-center">
																		<div className="relative flex-shrink-0 pt-0.5">
																			<GrGroup className="h-10 w-10" />
																		</div>

																		<div className="ml-3">
																			<p className="text-md font-sans text-white">
																				{channel.channelName}
																			</p>
																		</div>
																		<span className="flex flex-row space-x-3 ml-auto">
																			<button
																				className="w-full flex items-center justify-center text-sm font-medium text-indigo-600  hover:text-indigo-500 "
																				onClick={async () => {
																					if (context.user)
																					{
																						await inviteHandler(channel.channelId, true, context.user);
																						inviteChannels();
																					}
																				}}
																			>
																				<FiCheckCircle
																					size="25"
																					className="text-green-300 hover:scale-110"
																				/>
																			</button>
																			<button
																				className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium"
																				onClick={async () => {
																					if (context.user)
																					{
																						await inviteHandler(channel.channelId, false, context.user);
																						inviteChannels();
																					}

																				}}
																			>
																				<FiXCircle
																					size="25"
																					className="text-red-300 hover:scale-110"
																				/>
																			</button>
																		</span>
																	</div>
																</div>
															</div>
														</div>
												</div>
											))}
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</div>
			</div>
			<Toaster />
		</div>
	);
};

export default ChannelsLobby;
