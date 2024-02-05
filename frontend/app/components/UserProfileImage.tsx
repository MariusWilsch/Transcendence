'use client';

import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { use, useEffect, useState } from 'react';
import { useAppContext, AppProvider, User } from '../AppContext';
import { CiCirclePlus } from 'react-icons/ci';
import { CiSaveUp2 } from 'react-icons/ci';
import { FaCircle } from 'react-icons/fa';
import { PiGameControllerLight } from 'react-icons/pi';
import { motion, AnimatePresence } from 'framer-motion';
import { MdOutlineMailOutline } from 'react-icons/md';
import { HiUserGroup } from 'react-icons/hi2';
import { TfiFaceSmile } from 'react-icons/tfi';
import { LiaWalkingSolid } from 'react-icons/lia';
import { RxUpdate } from 'react-icons/rx';
import { log } from 'console';

export const UserProfileImage = ({
	status,
	isProfileOwner,
	src,
	intraId,
	userFromRoutId,
}: {
	status: string | undefined;
	isProfileOwner: boolean;
	src: string;
	intraId: string | undefined;
	userFromRoutId: User | undefined;
}) => {
	const { user, isDivVisible, toggleDivVisibility } = useAppContext();

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [friends, setfriends] = useState<number>(0);
	const [Onlinefriends, setOnlinefriends] = useState<number>(0);
	const [refreshFriends, setrefreshFriends] = useState<number>(0);

	useEffect(() => {
		setImagePreview(src);
	}, []);

	const getFriends = async () => {
		if (!user) {
			return;
		}
		try {
			const response: any = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${userFromRoutId?.intraId}/friends`,
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
				setfriends(data.friends.length);
			}
		} catch (error: any) {
			const msg = 'Error getting friends: ' + error.message;
			toast.error(msg);
		}
	};

	const onlineFriends = async () => {
		if (!user) {
			return;
		}
		try {
			const response: any = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${userFromRoutId?.intraId}/onlinefriends`,
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
			if (data.onlinefriends) {
				setOnlinefriends(data.onlinefriends.length);
			}
		} catch (error: any) {
			const msg = 'Error getting friends: ' + error.message;
			toast.error(msg);
		}
	};

	useEffect(() => {
		onlineFriends();
		getFriends();
	}, [user, refreshFriends]);

	const handleFileChange = (event: any) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			setSelectedFile(file);

			const previewURL = URL.createObjectURL(file);

			setImagePreview(previewURL);
		}
	};

	const handleUpload = async () => {
		if (selectedFile) {
			const formData = new FormData();
			formData.append('avatar', selectedFile);
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${intraId}/avatar`,
					{
						method: 'POST',
						body: formData,
						credentials: 'include',
					},
				);
				if (!response.ok) {
					toast.error('Failed to update the avatar');
					setSelectedFile(null);
					return;
				}
				const data = await response.json();
				if (data.success === false) {
					toast.error('Failed to update the avatar');
				} else {
					toast.success('avatar updated successfully');
				}
			} catch (error) {
				toast.error('Failed to update avatar');
			}
			setSelectedFile(null);
		} else {
			toast.error('Please select a file');
		}
	};

	const [numberofgames, setnumberofgames] = useState(0);
	const [winpercentage, setwinpercentage] = useState('');

	useEffect(() => {
		const Gamehistory = async () => {
			if (!userFromRoutId) return;
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}:3001/users/Gamehistory/${userFromRoutId.intraId}`,
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
				setnumberofgames(data.Gamehistory.length);

				let gameswon = 0;
				let gamesloss = 0;
				data.Gamehistory.forEach((game: any) => {
					if (game.winnerId !== intraId) {
						gameswon++;
					} else {
						gamesloss++;
					}
				});
				const totalGames = gameswon + gamesloss;
				const winPercentage =
					totalGames !== 0 ? ((gameswon / totalGames) * 100).toFixed(0) : '0';

				setwinpercentage(winPercentage);
			} catch (error) {}
		};
		Gamehistory();
	}, [intraId]);

	var readableDate: string = '';
	var readableDate1: string = '';
	var readableDate2: string = '';

	if (userFromRoutId) {
		readableDate = new Date(userFromRoutId?.created_at)
			.toISOString()
			.split('T')[0];
		readableDate1 = new Date(userFromRoutId?.updated_at)
			.toISOString()
			.split('T')[0];
		readableDate2 = new Date(userFromRoutId?.updated_at)
			.toISOString()
			.split('T')[1]
			.substring(0, 5);
	}

	const percentage: any = {
		'--value': winpercentage,
		'--size': '160px',
		fontSize: '44px',
	};

	return (
		<div>
			<div className="flex flex-col items-center justify-center">
				<div
					className={`backgroundDiv  md:h-80 h-48 flex justify-center relative `}
				>
					<div
						className={`hidden md:flex absolute md:h-80 h-48 w-full justify-center items-center`}
					>
						<div className="flex flex-row justify-between gap-[4%] w-[90%] h-5/6">
							<div className="w-1/3 bg-gray-900 rounded-md backdrop-blur-sm bg-opacity-30">
								<div className="m-3">
									<div className="text-white "> Win percentage : </div>
									<div className="w-full h-40 flex flex-row justify-center mt-4 mb-4">
										<div
											className="radial-progress text-green-400 font-extrabold  w-40 h-40 "
											style={percentage}
											role="progressbar"
										>
											{winpercentage}%
										</div>
									</div>
									<div className="text-gray-300 font-mono">
										<div className="inline text-blue-400">{numberofgames}&nbsp;</div>
										games played
									</div>
								</div>
							</div>
							<div className="w-1/3 h-2/3 bg-gray-900 rounded-md backdrop-blur-sm bg-opacity-30 ">
								<div className="m-4 overflow-hidden ">
									<div className="flex flex-row justify-between ">
										<div className="text-white mb-1 ">Total friends :</div>
										{isProfileOwner && (
											<button onClick={() => setrefreshFriends((prev) => prev + 1)}>
												<div className="tooltip ">
													<RxUpdate size="20" className="text-gray-400 inline mr-1" />
													<div className="tooltiptext w-20 bg-gray-800 bg-opacity-80 top-0 right-4 text-white p-3 rounded-md hover:transition duration-300 ease-in">
														Refresh
													</div>
												</div>
											</button>
										)}
									</div>
									<div className="mb-1 font-extrabold text-5xl text-blue-600 flex flex-row justify-between ml-2 mr-2">
										<div>{friends}</div>
										<div>
											<HiUserGroup />
										</div>
									</div>
									{isProfileOwner && (
										<div className="text-gray-300 text-sm font-mono">
											<div className="inline text-green-400 font-mono">
												{Onlinefriends}&nbsp;
											</div>
											online
										</div>
									)}
								</div>
							</div>
							{user ? (
								<div className="w-1/3 bg-gray-900 rounded-md backdrop-blur-sm bg-opacity-30 flex items-center overflow-hidden">
									<div className="m-5 overflow-hidden ">
										<div className=" text-white mb-3 ">
											<div className="tooltip">
												<div className="tooltiptext w-32 bg-gray-800 bg-opacity-80 top-0 left-4 text-white p-2 rounded-md hover:transition duration-300 ease-in">
													Full name
												</div>
												<TfiFaceSmile size="22" className="inline mr-[1px]" /> :{' '}
											</div>
											<div className="inline text-green-400 ">
												{userFromRoutId?.fullname}
											</div>
										</div>
										<div className=" text-white mb-3">
											<div className="tooltip">
												<div className="tooltiptext w-20 bg-gray-800 bg-opacity-80 top-0 left-4 text-white p-2 rounded-md hover:transition duration-300 ease-in">
													Email
												</div>
												<MdOutlineMailOutline size="21" className="inline" /> :{' '}
											</div>
											<div className="inline text-green-400 ">{userFromRoutId?.email}</div>
										</div>
										<div className=" text-white mb-3">
											<div className="tooltip">
												<div className="tooltiptext w-36 bg-gray-800 bg-opacity-80 top-0 left-4 text-white p-2 rounded-md hover:transition duration-300 ease-in">
													Joining date
												</div>
												<LiaWalkingSolid size="24" className="inline" />
											</div>
											{'  '}: <div className="inline text-green-400 ">{readableDate}</div>
										</div>
										<div className="font-sans text-white">
											<div className="tooltip">
												<div className="tooltiptext w-40 bg-gray-800 bg-opacity-80 -top-5 left-4 text-white p-2 rounded-md hover:transition duration-300 ease-in">
													Last profile update
												</div>
												<RxUpdate size="20" className="inline mr-1" /> :{' '}
											</div>
											<div className="inline text-blue-400 font-semibold">
												{readableDate2} &nbsp;
											</div>
											<div className="inline text-green-400 ">{readableDate1}</div>
										</div>
									</div>
								</div>
							) : (
								<div className="w-1/3 bg-gray-900 rounded-md backdrop-blur-sm bg-opacity-30 flex items-center overflow-hidden">
									<div className="m-5 overflow-hidden ">
										<div className=" text-white mb-3 ">
											<div className="tooltip">
												<div className="tooltiptext w-32 bg-gray-800 bg-opacity-80 top-0 left-4 text-white p-2 rounded-md hover:transition duration-300 ease-in">
													Full name
												</div>
												<TfiFaceSmile size="22" className="inline mr-[1px]" /> :{' '}
											</div>
											<div className="inline text-green-400 ">Full name</div>
										</div>
										<div className=" text-white mb-3">
											<div className="tooltip">
												<div className="tooltiptext w-20 bg-gray-800 bg-opacity-80 top-0 left-4 text-white p-2 rounded-md hover:transition duration-300 ease-in">
													Email
												</div>
												<MdOutlineMailOutline size="21" className="inline" /> :{' '}
											</div>
											<div className="inline text-green-400 ">Email</div>
										</div>
										<div className=" text-white mb-3">
											<div className="tooltip">
												<div className="tooltiptext w-36 bg-gray-800 bg-opacity-80 top-0 left-4 text-white p-2 rounded-md hover:transition duration-300 ease-in">
													Joining date
												</div>
												<LiaWalkingSolid size="24" className="inline" />
											</div>
											{'  '}: <div className="inline text-green-400 ">{readableDate}</div>
										</div>
										<div className="font-sans text-white">
											<div className="tooltip">
												<div className="tooltiptext w-40 bg-gray-800 bg-opacity-80 -top-5 left-4 text-white p-2 rounded-md hover:transition duration-300 ease-in">
													Last profile update
												</div>
												<RxUpdate size="20" className="inline mr-1" /> :{' '}
											</div>
											<div className="inline text-blue-400 font-semibold">
												{readableDate2} &nbsp;
											</div>
											<div className="inline text-green-400 ">{readableDate1}</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					<div
						className="w-48 h-48 md:w-72 md:h-72 md:mt-36 mt-16"
						style={{ position: 'relative', display: 'inline-block' }}
					>
						{imagePreview && (
							<Image
								unoptimized={true}
								src={imagePreview}
								alt="image Preview"
								width={300}
								height={300}
								priority={true}
								quality={100}
								className="rounded-full border-2 border-black w-48 h-48 md:w-72 md:h-72"
								onError={(e: any) => {
									e.target.onerror = null;
									e.target.src =
										'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
								}}
							/>
						)}

						{!isProfileOwner && (
							<div className="absolute right-[20px] bottom-[20px]  md:right-[37px] md:bottom-[37px] opacity-90">
								<div className="">
									<FaCircle
										className={`${
											status === 'ONLINE'
												? 'text-green-600 border-slate-950 border rounded-full'
												: ''
										} ${
											status === 'OFFLINE'
												? 'text-red-600 border-slate-950 border rounded-full'
												: ''
										} ${status != 'ONLINE' && status != 'OFFLINE' ? 'hidden' : ''}`}
										size="20"
									/>
									<div
										className={`${status != 'INGAME' ? 'hidden' : ''} ${
											status === 'INGAME'
												? 'text-white bg-black opacity-80 rounded-full p-2'
												: ''
										}`}
									>
										<PiGameControllerLight size="25" />
									</div>
								</div>
							</div>
						)}
						{selectedFile && isDivVisible && (
							<div
								style={{
									position: 'absolute',
									display: 'inline-block',
								}}
								className="w-48 h-48 md:w-72 md:h-72 top-0 left-0 flex flex-col items-center justify-center rounded-full
                  animate-moveLeftAndRight"
							>
								<button
									onClick={() => {
										handleUpload();
										toggleDivVisibility();
									}}
								>
									<div
										style={{
											position: 'absolute',
											display: 'inline-block',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
										}}
										className="bg-black w-48 h-48 md:w-72 md:h-72 rounded-full opacity-50 font-sans text-white text-lg font-medium"
									>
										<div
											style={{
												position: 'absolute',
												display: 'inline-block',
												top: '50%',
												left: '50%',
												transform: 'translate(-50%, -50%)',
											}}
										>
											save &nbsp;
											<CiSaveUp2 className="text-white inline-block" size="22" />
										</div>
									</div>
								</button>
							</div>
						)}
						<div
							className="mb-10 mr-10 md:mb-[58px] md:mr-[58px] opacity-90"
							style={{ position: 'absolute', bottom: 0, right: 0 }}
						>
							{isDivVisible && (
								<motion.div
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									initial={{ opacity: 0, y: -100, x: -100 }}
									animate={{ opacity: 1, x: 0, y: 0 }}
									transition={{ delay: 0.02 }}
								>
									<div className="absolute">
										<label htmlFor="avatar" className="cursor-pointer">
											<div className="bg-slate-300 mb-10 mr-10  md:mb-10 md:mr-10 rounded-full">
												<CiCirclePlus
													className="text-black "
													size="25"
													onChange={handleFileChange}
												/>
											</div>

											<input
												type="file"
												id="avatar"
												accept="image/*"
												onChange={handleFileChange}
												className="inset-0 cursor-pointer bg-black hidden"
											/>
										</label>
									</div>
								</motion.div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
