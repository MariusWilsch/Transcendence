'use client';
import React, { use, useEffect, useState } from 'react';
import { useAppContext, AppProvider } from '../AppContext';
import { Loading } from '../components/Loading';
import { useRouter } from 'next/navigation';
import Cookies from 'universal-cookie';
import { User } from '../AppContext';
import toast, { Toaster } from 'react-hot-toast';
import { IoIosMail } from 'react-icons/io';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const cookies = new Cookies();

const TwoFactorVerification = () => {
	const [id, setId] = useState('');

	useEffect(() => {
		const id = cookies.get('id');
		setId(id);
	}, []);

	const [otp, setOtp] = useState('');
	const router = useRouter();

	// if (!id) {
	//   return <Loading />;
	// }

	const handleVerify = async () => {
		try {
			if (otp.length != 6) {
				toast.error('Invalid OTP');
				return;
			}

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${id}/verifyOtp`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({ otp: otp }),
				},
			);
			const responseData = await response.json();

			if (responseData.sucess) {
				router.push(`/profile/${id}`);
			} else {
				toast.error('OTP not verified');
			}
		} catch (error: any) {
			toast.error('Error uploading otp');
			console.error('Error uploading otp: ', error.message);
		}
	};

	const handleKeyPress = (e: any) => {
		if (e.key === 'Enter') {
			handleVerify();
		}
	};

	return (
		<div className="h-screen w-screen bg-[#12141A]">
			<div>
				<div className="h-screen twofabackround flex flex-row">
					<div className="hidden md:flex justify-end items-center md:w-1/3 ">
						<Image
							src={'/sogo.svg'}
							priority={true}
							width={200}
							height={200}
							alt="Sogo Logo"
							className="opacity-80"
							unoptimized={true}
							onError={(e: any) => {
								e.target.onerror = null;
								e.target.src =
									'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
							}}
						/>
					</div>
					<div className="w-full md:w-2/3 flex items-center">
						<div className="mx-auto p-10 bg-[#292D39] backdrop-blur-3xl opacity-90 rounded-md shadow-md">
							<div>
								<h2 className="text-2xl font-semibold mb-5 text-white font-sans">
									Two-Factor Authentication
								</h2>
								<div className="text-md mb-5 text-slate-50 font-sans">
									A verification code has been sent to your 42 email
								</div>
								<div className="flex flex-row w-full justify-end  items-center">
									<label className="relative text-slate-100 font-sans flex-grow flex items-center">
										<input
											type="text"
											value={otp}
											placeholder="Enter the code"
											onChange={(e) => setOtp(e.target.value)}
											onKeyPress={handleKeyPress}
											className="p-2 px-8 relative h-10 bg-[#12141A] focus:outline-none focus:border-stone-400 appearance-none  w-full border rounded-md "
										/>
										<div className="absolute left-0 p-2">
											<IoIosMail size="20" />
										</div>
									</label>
									&nbsp;
									<button
										onClick={handleVerify}
										// onClick={() => setStartAnimation(true)}
										className="bg-slate-600 w-1/6 min-w-10 h-10 text-white rounded-md hover:bg-slate-500 focus:outline-none focus:ring focus:border-blue-200"
									>
										Verify
									</button>
								</div>
							</div>
						</div>
					</div>
					<Toaster />
				</div>
			</div>
		</div>
	);
};

export default TwoFactorVerification;
