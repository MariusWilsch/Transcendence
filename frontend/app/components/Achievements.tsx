'use client';

import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { use, useEffect, useState } from 'react';
import { useAppContext, AppProvider, User, MatchHistory } from '../AppContext';
import { RiPingPongLine } from 'react-icons/ri';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { GrGroup } from 'react-icons/gr';
import { FaUserFriends } from 'react-icons/fa';
import { GrAchievement } from 'react-icons/gr';
import { MdLeaderboard } from 'react-icons/md';
import { IoHome } from 'react-icons/io5';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { CiLogout } from 'react-icons/ci';
import { usePathname } from 'next/navigation';
import { FaCircleDot } from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegMinusSquare } from 'react-icons/fa';
import { FaRegSquarePlus } from 'react-icons/fa6';

export const Achievements = ({ intraId }: { intraId: string | undefined }) => {
	const [Achievements, setAchievements] = useState<string[] | undefined>(
		undefined,
	);

	useEffect(() => {
		const Achievements = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}:3001/users/Achievements/${intraId}`,
					{
						credentials: 'include',
					},
				);
				const data = await response.json();
				if (!response.ok) {
					return;
				}

				if (data.success === false) {
					return;
				}

				console.log(data);
				setAchievements(data.Achievements);
			} catch (error) {
				console.log(error);
			}
		};
		Achievements();
	}, [intraId]);

	return (
		<div className="flex items-center justify-center text-gray-400 w-full mt-10 p-10 overflow-hidden">
			<div className="border border-gray-600 bg-[#292D39] bg-opacity-70 rounded-md w-full md:w-[600px] lg:w-[800px] h-[300px] p-4 ">
				<div className="mt-1 font-bold text-gray-300">Achievements</div>	
				<div className="mt-5 border-b border-zinc-500 "></div>
				<div className="p-5 w-full h-[200px] overflow-x-hidden">
					{Achievements &&
						Achievements.toReversed().map((Achievement: any, index: any) => {
							return (
								<div
									key={index}
									className="flex flex-row mb-3 bg-[#292D39] bg-opacity-80 items-center  rounded-md justify-center  w-full "
								>
									<div className="w-full p-2 flex flex-row justify-center ">
											<div className="text-gray-200 text-sm m-2">{Achievement}</div>
									</div>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
};