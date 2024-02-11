'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppContext, User } from '../AppContext';
import toast, { Toaster } from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';
import Cookies from 'universal-cookie';
import { motion } from 'framer-motion';
import { FaCircle } from 'react-icons/fa';

export default function Friends() {
	const { user, setUser, setisSidebarVisible } = useAppContext();
	const [socket, setsocket] = useState<Socket | null>(null);

	useEffect(() => {
		const checkJwtCookie = async () => {
			if (user !== null) {
				return;
			}
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/user`,
					{
						method: 'GET',
						credentials: 'include',
					},
				);
				var data = await response.json();
				if (data.succes === false) {
					return;
				}
				if (data.data !== null && data.data !== undefined) {
					setUser(data.data);
				}
			} catch (error: any) {
				const msg = 'Error during login' + error.message;
				toast.error(msg);
				console.error('Error during login:', error);
			}
		};
		checkJwtCookie();
	}, []);

	useEffect(() => {
		setisSidebarVisible(window.innerWidth > 768);
	}, []);

	const [users, setUsers] = useState<User[] | undefined>(undefined);
	const [inputValue, setInputValue] = useState('');
	const [selectedFeild, setselectedFeild] = useState('Online');

	const PendingInvite = async () => {
		if (!user) {
			return;
		}
		try {
			const response: any = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${user?.intraId}/PendingInvite`,
				{
					method: 'GET',
					credentials: 'include',
				},
			);
			const data = await response.json();

			if (data.success === false) {
				const msg = 'Error getting friends';
				toast.error(msg);
			}
			if (data.friendsDetails) {
				setUsers(data.friendsDetails);
			}
		} catch (error: any) {
			const msg = 'Error getting friends: ' + error.message;
			toast.error(msg);
			console.error('Error getting friends:', error.message);
		}
	};

	const BlockedFriends = async () => {
		if (!user) {
			return;
		}
		try {
			const response: any = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${user?.intraId}/BlockedFriends`,
				{
					method: 'GET',
					credentials: 'include',
				},
			);
			const data = await response.json();

			if (data.success === false) {
				const msg = 'Error getting friends';
				toast.error(msg);
			}
			if (data.friendsDetails) {
				setUsers(data.friendsDetails);
			}
		} catch (error: any) {
			const msg = 'Error getting friends: ' + error.message;
			toast.error(msg);
			console.error('Error getting friends:', error.message);
		}
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (
			inputValue === undefined ||
			inputValue === null ||
			inputValue.trim().length === 0 ||
			inputValue.trim().length > 20
		) {
			return;
		}
		if (!/^[a-zA-Z0-9_\-+]+$/.test(inputValue)) {
			return toast.error('Invalid characters');
		}

		try {
			const data = {
				searchTerm: inputValue,
			};

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify(data),
				},
			);
			if (!response.ok) {
				toast.error('User not found');
				return;
			}

			const users: User[] = await response.json();
			setUsers(users);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const getFriends = async () => {
		if (!user) {
			return;
		}
		try {
			const response: any = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${user?.intraId}/friends`,
				{
					method: 'GET',
					credentials: 'include',
				},
			);
			const data = await response.json();
			if (response.success === false) {
				const msg = 'Error getting friends';
				toast.error(msg);
			}
			if (data.friends) {
				setUsers(data.friends);
			}
		} catch (error: any) {
			const msg = 'Error getting friends: ' + error.message;
			toast.error(msg);
			console.error('Error getting friends:', error.message);
		}
	};

	const onlineFriends = async () => {
		if (!user) {
			return;
		}
		try {
			const response: any = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${user?.intraId}/onlinefriends`,
				{
					method: 'GET',
					credentials: 'include',
				},
			);
			const data = await response.json();
			if (response.success === false) {
				const msg = 'Error getting friends';
				toast.error(msg);
				// console.log(msg);
			}
			if (data.onlinefriends) {
				setUsers(data.onlinefriends);
			}
		} catch (error: any) {
			const msg = 'Error getting friends: ' + error.message;
			toast.error(msg);
			console.error('Error getting friends:', error.message);
		}
	};

	useEffect(() => {
		onlineFriends();
	}, [user]);

	useEffect(() => {}, [inputValue]);

	const createsocket = () => {
		const handleClientsConnection = `${process.env.NEXT_PUBLIC_API_URL}:3002/handleClientsConnection`;

		const cookies = new Cookies();
		const newSocket = io(handleClientsConnection, {
			auth: { jwt: cookies.get('jwt') },
		});

		setsocket(newSocket);
	};

	const listenForEvents = () => {
		if (socket !== null) {
			socket.on('update', () => {
				onlineFriends();
				setselectedFeild('Online');
			});
		}
	};

	useEffect(() => {
		if (!socket) {
			createsocket();
		}
	}, []);

	useEffect(() => {
		if (socket) {
			listenForEvents();
		}
	}, [socket]);

	return (
		<div className="z-20 flex-1 overflow-y-auto">
			<div className="p-10">
				<div className="">
					<div className="mb-5 text-white font-sans">Friends </div>
					<div className="border-b border-gray-500 my-4 mb-10"></div>
					<div className="flex justify-center mb-8">
						<div className="flex flex-row justify-between md:w-[50vw] w-full  bg-gray-600 rounded-md mb-4">
							<button
								className="w-full"
								onClick={() => {
									onlineFriends();
									setselectedFeild('Online');
								}}
							>
								<div
									className={`${
										selectedFeild === 'Online'
											? 'underline underline-offset-8 text-slate-200'
											: 'text-slate-300'
									} font-sans p-3 hover:bg-gray-500 rounded-md w-full`}
								>
									Online
								</div>
							</button>
							<button
								className="w-full"
								onClick={() => {
									getFriends();
									setselectedFeild('All');
								}}
							>
								<div
									className={`${
										selectedFeild === 'All'
											? 'underline underline-offset-8 text-slate-200'
											: 'text-slate-300'
									} font-sans p-3 hover:bg-gray-500 rounded-md w-full`}
								>
									All
								</div>
							</button>
							<button
								className="w-full"
								onClick={() => {
									PendingInvite();
									setselectedFeild('Pending');
								}}
							>
								<div
									className={`${
										selectedFeild === 'Pending'
											? 'underline underline-offset-8 text-slate-200'
											: 'text-slate-300'
									} font-sans p-3 hover:bg-gray-500 rounded-md w-full`}
								>
									Pending
								</div>
							</button>
							<button
								className="w-full"
								onClick={() => {
									BlockedFriends();
									setselectedFeild('Blocked');
								}}
							>
								<div
									className={`${
										selectedFeild === 'Blocked'
											? 'underline underline-offset-8 text-slate-200'
											: 'text-slate-300'
									} font-sans p-3 hover:bg-gray-500 rounded-md w-full`}
								>
									Blocked
								</div>
							</button>
						</div>
					</div>
					{selectedFeild === 'All' && (
						<motion.div
							initial={{ opacity: 0, x: -100 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.02 }}
						>
							<div className="flex w-full justify-center mb-6 overflow-x-hidden">
								<div className="md:w-[50vw] w-[80vw] flex justify-center">
									<div className="md:w-[50vw] w-[80vw] flex justify-center">
										<form
											className="min-w-[80vw] md:min-w-[50vw]"
											onSubmit={handleSubmit}
										>
											<label className=" flex flex-grow ">
												<input
													id="searchField"
													name={`inputValue${Math.random()}`}
													type="text"
													value={inputValue}
													placeholder="Search ..."
													onChange={(e) => {
														setInputValue(e.target.value);
														handleSubmit(e);
													}}
													className="min-w-[80vw] md:min-w-[50vw] bg-[#1E2028] items-center justify-center p-2 rounded-lg border-opacity-40 border-2 border-slate-300  text-sm outline-none text-white"
												/>
												<div className="md:hidden">&nbsp; &nbsp;</div>
											</label>
										</form>
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
							<div className="mt-4 w-full flex flex-col items-center overflow-x-hidden">
								{users &&
									users?.map((user) => (
										<Link key={user.intraId} href={`/profile/${user.intraId}`}>
											<div
												key={user.intraId}
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
																	<img
																		className="h-10 w-10 rounded-full"
																		src={user.Avatar}
																		alt=""
																		onError={(e: any) => {
																			e.target.onerror = null;
																		}}
																	/>
																	{(selectedFeild === 'Online' || selectedFeild === 'All') && (
																		<div className="absolute right-0 bottom-0">
																			<div className="">
																				<FaCircle
																					className={`${
																						user.status === 'ONLINE'
																							? 'text-green-600 border-slate-950 border rounded-full'
																							: ''
																					} ${
																						user.status === 'OFFLINE'
																							? 'text-red-600 border-slate-950 border rounded-full'
																							: ''
																					} ${
																						user.status != 'ONLINE' && user.status != 'OFFLINE'
																							? 'hidden'
																							: ''
																					}`}
																					size="14"
																				/>
																			</div>
																		</div>
																	)}
																</div>

																<div className="ml-3 f">
																	<p className="text-md font-sans text-white">{user.login}</p>
																</div>
															</div>
														</div>
														<div className="flex border-l border-gray-900">
															<button className="items-center justify-center w-full border border-transparent rounded-none rounded-r-lg p-4 flex text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
																Profile
															</button>
														</div>
													</div>
												</motion.div>
											</div>
										</Link>
									))}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
			{/* <Toaster /> */}
		</div>
	);
}
