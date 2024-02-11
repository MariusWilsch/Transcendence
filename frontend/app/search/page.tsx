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

export default function Search(params: any) {
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

	useEffect(() => {
		setisSidebarVisible(window.innerWidth > 768);
	}, []);

	const [users, setUsers] = useState<User[] | undefined>(undefined);
	const [inputValue, setInputValue] = useState('');

	useEffect(() => {
		const searchTerm = params.searchParams.query;

		const handleSearchQuery = async (searchTerm: string) => {
			if (
				searchTerm === undefined ||
				searchTerm === null ||
				searchTerm.trim().length === 0
			) {
				return;
			}
			// console.log(searchTerm);
			try {
				const data = {
					searchTerm: searchTerm,
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
					return;
				}
				const users: User[] = await response.json();
				setUsers(users);
			} catch (error) {}
		};
		handleSearchQuery(searchTerm);
	}, []);

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

	useEffect(() => {}, [inputValue]);

	return (
		<div className="flex-1 overflow-y-auto">
			<div className="p-10">
				<div className="">
					<div className="mb-5 text-white font-sans">Search </div>
					<div className="border-b border-gray-500 my-4 mb-10"></div>

					<div className="w-full flex items-center justify-center mb-6">
						<div className="md:w-[50vw] w-full flex items-center justify-center">
							<div className="md:w-[50vw] w-full flex flex-row-reverse">
								<form className="w-full" onSubmit={handleSubmit}>
									<label className=" flex flex-grow ">
										<input
											id="handleSubmit"
											name={`searchTerm${Math.random()}`}
											type="text"
											value={inputValue}
											placeholder="Search ..."
											onChange={(e) => {
												setInputValue(e.target.value);
												handleSubmit(e);
											}}
											className="w-full bg-[#1E2028] items-center justify-center p-2 rounded-lg border-opacity-40 border-2 border-slate-300  text-sm outline-none text-white"
										/>
										<div className="md:hidden">&nbsp; &nbsp;</div>
										<button
											onClick={handleSubmit}
											className="md:hidden flex-grow items-center justify-center p-2 rounded-lg bg-[#292D39] text-white"
											type="submit"
										>
											<RiSearchLine size="30" className="" />
										</button>
									</label>
								</form>
							</div>
						</div>
					</div>
					<div className="mt-4 flex  justify-center ">
						<div className="mt-4 w-full flex flex-col items-center">
							{users &&
								users?.map((user) => (
									<Link
										key={user.intraId}
										href={`/profile/${user.intraId}`}
										className=""
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
												className=" p-2 mb-2 min-w-[80vw] md:min-w-[50vw] items-center justify-center "
											>
												<div className="max-w-md w-full min-w-full bg-[#1E2028] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
													<div className="flex-1 w-0 p-4">
														<div className="flex items-center">
															<div className="flex-shrink-0 pt-0.5">
																<img
																	className="h-10 w-10 rounded-full"
																	src={user.Avatar}
																	alt=""
																/>
															</div>
															<div className="ml-3 f">
																<p className="text-md font-sans text-white">{user.login}</p>
															</div>
														</div>
													</div>

													<div className="flex border-l border-gray-900">
														<button className="items-center justify-center w-full border border-transparent rounded-none rounded-r-lg p-4 flex text-sm font-medium text-indigo-600 ">
															Profile
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
			{/* <Toaster /> */}
		</div>
	);
}
