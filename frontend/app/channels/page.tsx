'use client';
// import '@mantine/core/styles.css';
import { Channel, User, useAppContext } from '@/app/AppContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { io } from 'socket.io-client';
import Cookies from 'universal-cookie';
import { motion } from 'framer-motion';
import { GrGroup } from 'react-icons/gr';
import JoinProtectedChannel from '../chatComponents/JoinProtectedChannel';
import Demo from '../chatComponents/Demo';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { MantineProvider } from '@mantine/core';

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
		if (response.ok) {
			if (status) {
				toast.success('you  successfully joined the channel');
			} else {
				toast.success('invitation is declained');
			}
		} else {
			const msg = 'Error: ' + response;
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
	const [selectedFeild, setselectedFeild] = useState('my channels');

	const handleFilterCHannels = (query: string, channels: Channel[] | []) => {
		return channels.filter((item) => item.name.startsWith(query));
	};
	useEffect(() => {
		const checkJwtCookie = async () => {
      if (context.user !== null) {
				return;
			}
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/user`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
						credentials: 'include',
					},
				);
				var data = await response.json();
				if (data.succes === false) {
					return;
				}
				if (data.data !== null && data.data !== undefined) {
					context.setUserData(data.data);
				}
			} catch (error: any) {
				const msg = 'Error during login' + error.message;
				toast.error(msg);
				console.error('Error during login:', error);
			}
		};
		checkJwtCookie();
		if (!context.socket) {
			const chatNameSpace = `${process.env.NEXT_PUBLIC_API_URL}:3002/chat`;
			const cookie = new Cookies();
			const newSocket = io(chatNameSpace, {
				query: { user: cookie.get('jwt') },
			});
			context.setSocket(newSocket);
		}
		// if (context.socket) {
		//   context.socket.on('JoinAChannel', (res: any) => {
		//     const msg = res.e;
		//     if (msg === "password incorrect") {
		//       toast.error(msg);
		//     }
		//     else {
		//       toast.success(msg);
		//       exploreChannels();
		//     }
		//   })
		// }
	}, [context.socket, availabelChannels]);

	useEffect(() => {
		if (inputValue && availabelChannels) {
			setAvailableChannels(handleFilterCHannels(inputValue, availabelChannels));
		}
	}, [inputValue]);
	// const [users, setUsers] = useState<User[] | undefined>(undefined);

	const userChannels = async () => {
		if (!context.userData) {
			return;
		}
		try {
			const response: any = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/channels/${context.userData?.intraId}/userChannels`,
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
			}
		} catch (error: any) {
			const msg = 'Error getting friends: ' + error.message;
			toast.error(msg);
		}
	};
	const exploreChannels = async () => {
		if (!context.userData) {
			return;
		}
		try {
			const response: any = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/channels/${context.userData.intraId}/availabelChannels`,
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
		if (!context.userData) {
			return;
		}
		try {
			const response: any = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/chat/channelInvitation/${context.userData.intraId}`,
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
										onClick={() => {
											userChannels();
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
											exploreChannels();
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
											inviteChannels();
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
								<motion.div
									initial={{ opacity: 0, x: -100 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.02 }}
								>
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
													{/* <button
                              onClick={() => console.log('cho-fo-uniiiii')}
                              className="md:hidden flex-grow items-center justify-center p-2 rounded-lg bg-[#292D39] text-white"
                              type="submit"
                            >
                              <RiSearchLine size="30" className="" />
                            </button> */}
												</label>
											</div>
										</div>
									</div>
								</motion.div>
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
												<Demo />{' '}
											</div>
										)}
										{availabelChannels &&
											selectedFeild === 'Explore' &&
											availabelChannels.map((channel: Channel) => (
												<div
													key={channel.name}
													className=" p-2 mb-2 min-w-[80vw] md:min-w-[50vw] items-center justify-center "
												>
													<motion.div
														whileTap={{ scale: 0.9 }}
														whileHover={{ scale: 1.1 }}
														initial={{ opacity: 0, y: -100 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: 0.02 }}
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
													</motion.div>
												</div>
											))}
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
										{invitationChannels &&
											selectedFeild === 'Invitations' &&
											invitationChannels?.map((channel: any) => (
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
																				onClick={() => {
																					inviteHandler(channel.channelId, true, context.userData);
																				}}
																			>
																				<FiCheckCircle
																					size="25"
																					className="text-green-300 hover:scale-110"
																				/>
																			</button>
																			<button
																				className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium"
																				onClick={() => {
																					inviteHandler(channel.channelId, false, context.userData);
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
													</motion.div>
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
