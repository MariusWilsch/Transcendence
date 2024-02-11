'use client';

import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useAppContext, AppProvider, User, Message } from '../AppContext';
import { RiPingPongLine } from 'react-icons/ri';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { GrGroup } from 'react-icons/gr';
import { FaUserFriends } from 'react-icons/fa';
import { MdLeaderboard } from 'react-icons/md';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { CiLogout } from 'react-icons/ci';
import { usePathname } from 'next/navigation';
import { FaCircleDot } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import Cookies from 'universal-cookie';
import { io } from 'socket.io-client';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import useStartGame from '@/app/gamelobby/hooks/useStartGame';
import {
	ConnectionStatus,
	Invite,
	disconnect,
	setPrivateMatch,
} from '../gamelobby/GlobalRedux/features';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../gamelobby/GlobalRedux/store';

export const Sidebar = () => {
	const [RouterName, setRouterName] = useState('profile');
	const [renderOnce, setRenderOnce] = useState(false);
	const pathname = usePathname();
	const { handleInvite } = useStartGame();
	const { isConnected, isGameStarted, countDownDone } = useSelector(
		(state: RootState) => state.connection,
	);
	const dispatch = useDispatch();
	const context = useAppContext();
	const pattern: RegExp = /^\/chat\/\d+$/;

	const getFriends = async () => {
		try {
			if (context.user?.intraId) {
				const response: any = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${context.user.intraId}/freindrequest`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
						credentials: 'include',
					},
				);
				const data = await response.json();
				if (data.success === true && data.empty == false) {
					context.setnotif(true);
				}
				if (data.success === true && data.empty == true) {
					context.setnotif(false);
				}
			}
		} catch (error: any) {
			const msg = 'Error getting friends: ' + error.message;
			toast.error(msg);
			console.error('Error getting friends:', error.message);
		}
	};

	useEffect(() => {
		if (countDownDone && isGameStarted && pathname !== '/gamelobby/game') {
			dispatch(disconnect());
		}
	}, [pathname, isGameStarted]);

	const handleFriendshipRequest = () => {
		getFriends();
	};

	const listenForFriendships = () => {
		if (context.notifSocket !== null) {
			context.notifSocket.on('FriendShipRequest', handleFriendshipRequest);
		}
	};

	useEffect(() => {
		// console.log("Here")
		if (context.notifSocket) {
			listenForFriendships();
		}
	}, [context.user, context.notifSocket]);

	useEffect(() => {
		if (!context.socket) {
			const chatNameSpace = `${process.env.NEXT_PUBLIC_API_URL}:3002/chat`;
			const cookie = new Cookies();
			const newSocket = io(chatNameSpace, {
				query: { user: cookie.get('jwt') },
			});
			context.setSocket(newSocket);
		}
	}, [context.socket]);

	useEffect(() => {
		if (context.socket && context.user) {
			context.socket.on('privateMatch', (data: any) => {
				const msg = data.from.login + ' invite you for a game';
				toast(
					(t) => (
						<div className="flex flex-row items-center ">
							<div className="font-serif text-black font-semibold w-[64%]">{msg}</div>
							<button
								className="w-[18%] flex items-center justify-center text-sm font-medium text-indigo-600  hover:text-indigo-500 "
								onClick={() => {
									toast.dismiss(t.id);
									handleInvite(context.user?.intraId, isConnected, Invite.ACCEPTING);
								}}
							>
								<FiCheckCircle size="30" className="text-green-300" />
							</button>
							<button
								className="w-[18%] border border-transparent rounded-none rounded-r-lg flex items-center justify-center text-sm font-medium"
								onClick={() => {
									toast.dismiss(t.id);
									handleInvite(context.user?.intraId, isConnected, Invite.REJECTING);
								}}
							>
								<FiXCircle size="30" className="text-red-300" />
							</button>
						</div>
					),
					{
						id: data.from.login,
					},
				);
			});
			return () => {
				if (context.socket) {
					context.socket.off('privateMatch');
				}
			};
		}
	}, [context.socket, context.user, isConnected]);

	useEffect(() => {
		if (context.socket && !pathname.match(pattern)) {
			context.socket.on('messageNotification', (data: any) => {
				if (context?.user) {
					context.setMessageNum(context.messageNumb + 1);
					toast.success(`new message`, {
						id: 'message',
					});
				}
			});
		}

		return () => {
			if (context.socket) {
				context.socket.off('messageNotification');
			}
		};
	}, [context.socket, context.messageNumb, context.user, pathname]);

	useEffect(() => {
		const segments = pathname.split('/');
		setRouterName(segments[1]);
	}, [pathname]);

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
						credentials: 'include',
					},
				);
				var data = await response.json();
				if (data.succes === false) {
					return;
				}
				if (data.data !== null && data.data !== undefined) {
					context.setUser(data.data);
				}
			} catch (error: any) {
				const msg = 'Error during login' + error.message;
				toast.error(msg);
				console.error('Error during login:', error);
			}
		};
		checkJwtCookie();
	}, []);

	const handleResize = () => {
		const shouldHideSidebar = window.innerWidth < 768;
		context.setisSidebarVisible(!shouldHideSidebar);
	};

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div>
			{context.isSidebarVisible && (
				<div className="z-50 w-16 custom-height bg-[#292D39]">
					<div
						className={`transition-all duration-500 ease-in-out ${
							context.isSidebarVisible ? 'w-16 opacity-100' : 'w-0 opacity-0'
						}`}
					>
						<div className="relative custom-height bg-[#292D39] ">
							<div className="absolute buttom-0 left-0 bg-[#292D39]">
								<div className=" custom-height fixed text-black bg-[#292D39]">
									<ul className="list-none text-center justify-center items-center w-[64px] bg-[#292D39]">
										<div className="flex flex-col justify-between custom-height bg-[#292D39]">
											<div
												className={`${
													context.user === null
														? 'pointer-events-none'
														: 'pointer-events-auto'
												}
                    `}
											>
												<li className="">
													<Link href={`/profile/${context.user?.intraId}`}>
														<motion.div
															whileTap={{ scale: 0.8 }}
															initial={{ opacity: 0 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.01 }}
														>
															<CgProfile
																size="30"
																className={`${
																	RouterName === 'profile' ? 'text-slate-50' : 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8
                        `}
															/>
														</motion.div>
													</Link>
												</li>
												<li className="relative">
													<motion.div
														whileTap={{ scale: 0.8 }}
														initial={{ opacity: 0 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: 0.01 }}
													>
														<Link href={`${process.env.NEXT_PUBLIC_API_URL}:3000/notif`}>
															<IoMdNotificationsOutline
																size="30"
																className={`${
																	RouterName === 'notif' ? 'text-slate-50' : 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8`}
															/>
															{context.notif && (
																<div className="absolute top-0 right-4 flex items-end">
																	<FaCircleDot
																		size="14"
																		className="text-red-600 opacity-80 animate-ping"
																	/>
																</div>
															)}
														</Link>
													</motion.div>
												</li>
												<li>
													<motion.div
														whileTap={{ scale: 0.8 }}
														initial={{ opacity: 0 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: 0.01 }}
													>
														<Link href={`/leaderboard`}>
															<MdLeaderboard
																size="30"
																className={`${
																	RouterName === 'leaderboard'
																		? 'text-slate-50'
																		: 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8`}
															/>
														</Link>
													</motion.div>
												</li>
												<li>
													<Link href={`${process.env.NEXT_PUBLIC_API_URL}:3000/friends`}>
														<motion.div
															whileTap={{ scale: 0.8 }}
															initial={{ opacity: 0 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.01 }}
														>
															<FaUserFriends
																size="30"
																className={`${
																	RouterName === 'friends' ? 'text-slate-50' : 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8`}
															/>
														</motion.div>
													</Link>
												</li>
												<li>
													<Link href={`${process.env.NEXT_PUBLIC_API_URL}:3000/channels`}>
														<motion.div
															whileTap={{ scale: 0.8 }}
															initial={{ opacity: 0 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.01 }}
														>
															<GrGroup
																size="30"
																className={`${
																	RouterName === 'channels' ? 'text-slate-50' : 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8`}
															/>
														</motion.div>
													</Link>
												</li>
												<li>
													<Link
														href={`${process.env.NEXT_PUBLIC_API_URL}:3000/chat`}
														onClick={() => context.setMessageNum(0)}
														className="relative"
													>
														<motion.div
															whileTap={{ scale: 0.8 }}
															initial={{ opacity: 0 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.01 }}
														>
															<IoChatbubblesOutline
																size="30"
																className={`${
																	RouterName === 'chat' ? 'text-slate-50' : 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8`}
															/>
															{context.messageNumb > 0 && (
																<div className="notification-dot">
																	{context?.messageNumb > 99 ? '99+' : context?.messageNumb}
																</div>
															)}
														</motion.div>
													</Link>
												</li>
												<li>
													<Link href={`${process.env.NEXT_PUBLIC_API_URL}:3000/gamelobby`}>
														<motion.div
															whileTap={{ scale: 0.8 }}
															initial={{ opacity: 0 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.01 }}
														>
															<RiPingPongLine
																size="30"
																className={`${
																	RouterName === 'play' ? 'text-slate-50' : 'text-slate-500'
																} hover:text-slate-50 mx-auto m-8`}
															/>
														</motion.div>
													</Link>
												</li>
											</div>
											<div>
												<li className=" ">
													<Link href={`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/logout`}>
														<motion.div
															whileTap={{ scale: 0.8 }}
															initial={{ opacity: 0 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ delay: 0.01 }}
														>
															<CiLogout
																size="30"
																className={`text-slate-400 mx-auto m-8 hover:text-red-400`}
															/>
														</motion.div>
													</Link>
												</li>
											</div>
										</div>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
