'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useAppContext, AppProvider, User } from '../AppContext';
import toast, { Toaster } from 'react-hot-toast';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { RiSearchLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { TbSquareRoundedNumber1 } from 'react-icons/tb';

export default function Search(params: any) {
	const context = useAppContext();
	const [users, setUsers] = useState<any[] | undefined>(undefined);
	const [page, setPage] = useState(1);

	useEffect(() => {
		context.setisSidebarVisible(window.innerWidth > 768);
	}, []);

	const leaderboard = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users/leaderboard?page=${page}`,
				{
					method: 'GET',
					credentials: 'include',
				},
			);

			const data = await response.json();
			if (data.success === true) {
				setUsers(data.leaderboard);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		leaderboard();
	}, [page]);

	const getRadialProgressStyles = (winrate : any) => {
		return {
		  '--size': '60px',
		  fontSize: '16px',
		  '--value': winrate.toFixed(0),
		};
	  };

	return (
		<div className="flex-1 overflow-y-auto overflow-x-hidden">
			<div className="p-10">
				<div className="">
					<div className="mb-5 text-white font-sans">Leaderboard </div>
					<div className="border-b border-gray-500 my-4 mb-10"></div>

					<div className="mt-4 flex  justify-center ">
						<div className="mt-4 w-full flex flex-col items-center overflow-x-hidden">
							{users &&
								users.map((user, index) => (
									<Link
										prefetch={false}
										key={user.intraId}
										href={`/profile/${user.intraId}`}
									>
										<motion.div
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											initial={{ opacity: 0, y: -5 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.02 }}
										>
											<div
												key={user.intraId}
												className="p-2 mb-2 min-w-[80vw] md:min-w-[50vw] items-center justify-center"
											>
												<div className="max-w-md w-full min-w-full bg-[#1E2028] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
													<div className="flex-1 w-0 p-4">
														<div className="flex items-center">
															<div className="relative flex-shrink-0 pt-0.5">
																<img
																	className="h-14 w-14 rounded-full"
																	src={user.Avatar}
																	alt=""
																	onError={(e: any) => {
																		e.target.onerror = null;
																		e.target.src =
																			'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
																	}}
																/>
																<div className="absolute -right-2 top-5 text-2xl">
																	{index + 1 === 1 && page === 1 && '🥇'}
																	{index + 1 === 2 && page === 1 && '🥈'}
																	{index + 1 === 3 && page === 1 && '🥉'}
																</div>
															</div>
															<div className="ml-3">
																<div className="text-md font-sans text-white">
																	{index + 1 === 1 && page === 1 && (
																		<div> Pong champ {user.login}</div>
																	)}
																	{index + 1 === 2 && page === 1 && (
																		<div> Ball wizard {user.login}</div>
																	)}
																	{index + 1 === 3 && page === 1 && (
																		<div> Pong king {user.login}</div>
																	)}
																	{(index + 1 > 3 || page !== 1) && <div> {user.login}</div>}
																</div>
															</div>
														</div>
													</div>

													<div className="flex">
														<button className="items-center justify-center w-full border border-transparent rounded-none rounded-r-lg p-4 flex text-sm font-medium text-indigo-600 ">
															<div className="text-lg font-bold text-blue-400 mr-2">
																<div
																	className="radial-progress"
																	style = {getRadialProgressStyles(user.winrate)}
																	role="progressbar"
																>
																	{user.winrate.toFixed(0)}%
																</div>
															</div>
														</button>
													</div>
												</div>
											</div>
										</motion.div>
									</Link>
								))}
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-row items-end justify-center  z-20 mb-5">
				<div className="join z-20">
					<button
						className="join-item btn"
						onClick={() => {
							if (page > 1) {
								leaderboard();
								setPage((prev) => prev - 1);
							} else {
							}
						}}
					>
						«
					</button>
					<button className="join-item btn">{page}</button>
					<button
						className="join-item btn"
						onClick={() => {
							if (users && users.length === 10) {
								leaderboard();
								setPage((prev) => prev + 1);
							} else {
								toast('No more users', {
									icon: '🙅',
									style: {
										borderRadius: '10px',
										background: '#333',
										color: '#fff',
									},
								});
							}
						}}
					>
						»
					</button>
				</div>
			</div>
			<Toaster />
		</div>
	);
}
