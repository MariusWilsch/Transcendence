'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useAppContext, AppProvider, User } from '../AppContext';
import { CiEdit } from 'react-icons/ci';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';
import { CiSearch } from 'react-icons/ci';
import { useParams, redirect, useRouter, usePathname } from 'next/navigation';
import pong from '../../public/pong.svg';
import { IoMenuOutline } from 'react-icons/io5';

export const Navbar = () => {
	const {
		user,
		setUser,
		isDivVisible,
		toggleDivVisibility,
		setDivVisible,
		isSidebarVisible,
		setisSidebarVisible,
		toggleSidebarVisibleVisibility,
	} = useAppContext();

	const [inputValue, setInputValue] = useState('');
	const router = useRouter();
	const pathname = usePathname();

	const handleSubmit = (event: any) => {
		event.preventDefault();
		if (
			inputValue === undefined ||
			inputValue === null ||
			inputValue.trim().length === 0
		) {
			return;
		}
		if (inputValue.trim().length < 3) {
			return toast.error('Write at least 3 characters');
		}
		if (inputValue.trim().length > 20) {
			return toast.error('TOO LONG');
		}
		if (!/^[a-zA-Z0-9_\-+]+$/.test(inputValue)) {
			return toast.error('Invalid characters');
		}
		return router.push(
			`${process.env.NEXT_PUBLIC_API_URL}:3001/users/search?searchTerm=${inputValue}`,
		);
	};

	const [isProfileOwner, setIsProfileOwner] = useState<boolean>(false);
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
			} catch (error: any) {}
		};
		checkJwtCookie();
	}, []);

	useEffect(() => {
		if (pathname.split('/')[1] === 'profile') {
			if (pathname.split('/')[2] === user?.intraId) {
				setIsProfileOwner(true);
			}
		} else {
			setIsProfileOwner(false);
		}
	}, [user, pathname]);

	return (
		<div className="z-20 bg-[#1F212A] flex flex-row w-[100vw]">
			<div className="w-16 h-16 bg-[#292D39]">
				<Image
					unoptimized={true}
					src={pong}
					alt="Description of the image"
					priority={true}
					width={100}
					height={100}
					sizes=""
					style={{ filter: 'invert(100%)' }}
					onError={(e: any) => {
						e.target.onerror = null;
						e.target.src =
							'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
					}}
				/>
			</div>

			<div className="flex-grow items-center">
				<div className="">
					<div className="flex-row flex items-center">
						<div className="flex-row flex items-center justify-between">
							<div className="flex items-center p-3 md:hidden">
								<button onClick={toggleSidebarVisibleVisibility}>
									<IoMenuOutline size="30" className="text-white" />
								</button>
							</div>
							<div className="flex items-center md:p-3">
								<Link href={`/search`}>
									<CiSearch size="30" className="text-slate-400 " />
								</Link>
								<div className="md:inline-block hidden">
									<form className="" onSubmit={handleSubmit}>
										<label className="">
											<input
												id="handleSubmit"
												name={`searchTerm${Math.random()}`}
												type="text"
												value={inputValue}
												placeholder="Search ..."
												onChange={(e) => {
													setInputValue(e.target.value);
												}}
												className="placeholder:text-slate-400 bg-[#1E2028] items-center justify-center p-2 rounded-lg text-sm outline-none text-white"
											/>
										</label>
									</form>
								</div>
							</div>
						</div>
						<div className="flex justify-end p-4 flex-grow md:mr-3">
							{!isDivVisible && isProfileOwner && (
								<button onClick={toggleDivVisibility} className="tooltip">
									<div className="text-sm tooltiptext w-24 bg-gray-800 bg-opacity-80 top-0 right-8 text-white p-1 rounded-md hover:transition duration-300 ease-in">
										Edit profile
									</div>
									<CiEdit className="text-white" size="25" />
								</button>
							)}
							{isDivVisible && isProfileOwner && (
								<button onClick={toggleDivVisibility}>
									<IoIosCloseCircleOutline className="text-white" size="25" />
								</button>
							)}
							{!isProfileOwner && user && (
								<Link href={`/profile/${user.intraId}`} className="flex flex-row">
									<Image
										src={user.Avatar}
										alt="Description of the image"
										priority={true}
										width={30}
										height={30}
										sizes=""
										className="rounded-full mr-2 w-[30px] h-[30px]"
										unoptimized={true}
										onError={(e: any) => {
											e.target.onerror = null;
											e.target.src =
												'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
										}}
									/>
									<div className="text-slate-400 font-sans">{user.login}</div>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
