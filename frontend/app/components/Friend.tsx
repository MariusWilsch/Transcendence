'use client';

import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { use, useEffect, useState } from 'react';
import { useAppContext, AppProvider, User } from '../AppContext';
import { MdOutlineBlock } from 'react-icons/md';
import { CgUnblock } from 'react-icons/cg';
import { BiMessageRounded } from 'react-icons/bi';
import { IoGameControllerOutline } from 'react-icons/io5';
import { FiUserPlus } from 'react-icons/fi';
import { TbUserOff } from 'react-icons/tb';
import { FaUserTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useStartGame from '@/app/gamelobby/hooks/useStartGame';
import { MatchType } from '@/interfaces';

export const Friend = ({
	isProfileOwner,
	userId,
	friendId,
}: {
	isProfileOwner: boolean;
	userId: string | undefined;
	friendId: string;
}) => {
	const context = useAppContext();
	const { initSocketPushGame } = useStartGame();

	const [friendshipStatus, setStatus] = useState<
		'NOTFRIENDS' | 'PENDING' | 'ACCEPTED' | 'BLOCKED'
	>('NOTFRIENDS');

	const addfriend = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users/addfriend`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({
						userId: `${userId}`,
						friendId: `${friendId}`,
					}),
				},
			);

			const data = await response.json();

			if (data.success === false) {
				setStatus('NOTFRIENDS');
				toast.error('Error adding friend');
			} else {
				toast.success('Friend request sent');
			}
		} catch (error: any) {
			const msg = 'Error adding friend: ' + friendId;
			toast.error(msg);
			console.error('Error adding friend:', error.message);
		}
	};

	const blockFriend = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users/blockfriend`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({
						userId: `${userId}`,
						friendId: `${friendId}`,
					}),
				},
			);

			const data = await response.json();

			if (data.success === false) {
				toast.error('Error blocking friend');
			} else {
				toast.success('Friend blocked successfully');
			}
		} catch (error: any) {
			const msg = 'Error adding friend: ' + friendId;
			toast.error(msg);
			console.error('Error adding friend:', error.message);
		}
	};

	const removefrinship = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users/removefrinship`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({
						userId: `${userId}`,
						friendId: `${friendId}`,
					}),
				},
			);

			const data = await response.json();

			if (data.success === false) {
				toast.error('Error removing the friend');
			} else if (data.success === true) {
				toast.success('Friendship removed');
			}
		} catch (error: any) {
			toast.error('Error adding friend ');
			console.error('Error adding friend:', error.message);
		}
	};

	const [blocked, setblocked] = useState<boolean>(false);
	const [sender, setSender] = useState<boolean>(false);

	const FriendshipStatus = async () => {
		if (!userId) {
			return;
		}
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${userId}/FriendshipStatus/${friendId}`,
				{
					method: 'GET',
					credentials: 'include',
				},
			);

			const data: any = await response.json();
			if (!data.success) {
				toast.error('Error during FriendshipStatus');
				return;
			}
			if (!data.friend) {
				setStatus('NOTFRIENDS');
			} else {
				setStatus(data.friend.friendshipStatus);
			}
			if (data.friend && data.friend.friendshipStatus) {
				if (
					data.friend.friendshipStatus === 'BLOCKED' &&
					data.friend.friendId === userId
				) {
					setblocked(true);
				}
			}
			if (data.friend && data.friend.friendshipStatus) {
				if (
					data.friend.friendshipStatus === 'PENDING' &&
					data.friend.userId === friendId
				) {
					// setSender(true);
				}
			}
		} catch (error: any) {
			toast.error('Error during FriendshipStatus');
		}
	};

	useEffect(() => {
		FriendshipStatus();
	}, [userId]);

	return (
		<div className="mt-6">
			{!isProfileOwner && (
				<div
					className={`flex items-center justify-center text-white ${
						blocked ? 'cursor-not-allowed' : ''
					}`}
				>
					<div className="mx-2">
						{friendshipStatus !== 'ACCEPTED' &&
							friendshipStatus !== 'PENDING' && (
								<button
									className={`${blocked ? 'pointer-events-none' : ''}`}
									onClick={() => {
										addfriend();
										if (context.notifSocket) {
											context.notifSocket.emit('FriendShipRequest', {
												userId: `${userId}`,
												friendId: `${friendId}`,
											});
										}
										setStatus('PENDING');
									}}
								>
									<motion.div
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										initial={{ opacity: 0, y: -5 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.02 }}
									>
										<FiUserPlus size="25" />
									</motion.div>
								</button>
							)}
						{friendshipStatus === 'PENDING' && (
							<button
								className={`${blocked ? '  pointer-events-none' : ''}
                  ${sender ? '  pointer-events-none' : ''}`}
								onClick={() => {
									removefrinship();
									if (context.notifSocket) {
										context.notifSocket.emit('FriendShipRequest', {
											userId: `${userId}`,
											friendId: `${friendId}`,
										});
									}
									setStatus('NOTFRIENDS');
								}}
							>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									initial={{ opacity: 0, y: -5 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.02 }}
								>
									<FaUserTimes size="25" className="text-red-200" />
								</motion.div>
							</button>
						)}
						{friendshipStatus === 'ACCEPTED' && (
							<button
								className={`${blocked ? '  pointer-events-none' : ''}`}
								onClick={() => {
									removefrinship();
									setStatus('NOTFRIENDS');
								}}
							>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									initial={{ opacity: 0, y: -5 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.02 }}
								>
									<TbUserOff size="25" className="text-red-200" />
								</motion.div>
							</button>
						)}
					</div>
					<div className="mx-2">
						{friendshipStatus === 'BLOCKED' && (
							<button
								className={`${blocked ? '  pointer-events-none' : ''}`}
								onClick={() => {
									removefrinship();
									setStatus('NOTFRIENDS');
								}}
							>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									initial={{ opacity: 0, y: -5 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.02 }}
								>
									<CgUnblock size="27" className="text-white rotate-90" />
								</motion.div>
							</button>
						)}
						{friendshipStatus !== 'BLOCKED' && (
							<button
								className={`${blocked ? '  pointer-events-none' : ''}`}
								onClick={() => {
									blockFriend();
									setStatus('BLOCKED');
								}}
							>
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									initial={{ opacity: 0, y: -5 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.02 }}
								>
									<MdOutlineBlock size="25" className="text-red-200" />
								</motion.div>
							</button>
						)}
					</div>
					<div>
						<button
							className={`mx-2 ${blocked ? '  pointer-events-none' : ''}`}
						>
							<motion.div
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.02 }}
							>
								<BiMessageRounded size="25" />
							</motion.div>
						</button>
					</div>
					<div>
						{/* Here comes the private match logic */}
						<button
							className={`mx-2 ${blocked ? '  pointer-events-none' : ''}`}
							//! Friend ID here
							onClick={() => initSocketPushGame(MatchType.PRIVATE, 'friendId')}
						>
							<motion.div
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.02 }}
							>
								<IoGameControllerOutline size="25" />
							</motion.div>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
