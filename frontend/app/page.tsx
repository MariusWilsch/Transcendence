'use client';

import Image from 'next/image';
import logo from '../public/42_Logo.svg';
import Link from 'next/link';
import { CiLogin } from 'react-icons/ci';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { useEffect, useState, useRef } from 'react';
import { useParams, redirect, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useAppContext, AppProvider, User } from './AppContext';
import pong from '../public/pong.svg';
import { FaGithub } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa6';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import loading from '../public/loading.json';

export default function Home() {
	const router = useRouter();
	const contex = useAppContext();
	const lottieRef = useRef<LottieRefCurrentProps>(null);

	const checkJwtCookie = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/user`,
				{
					method: 'GET',
					credentials: 'include',
				},
			);
			var data  = await response.json();
			if (data.succes === false) {
				return;
			}

			if (data.data !== null && data.data !== undefined) {
				contex.setUser(data.data);
				if (data.data.intraId) {
					toast('Welcome back ' + data.data.login + ' !', {
						style: {
							border: '1px solid',
							padding: '16px',
						},
						icon: '👋',
					});
					return router.push(`/profile/${data.data.intraId}`);
				}
			}
		} catch (error: any) {}
	};

	useEffect(() => {
		checkJwtCookie();
	}, []);

	const [selectedId, setSelectedId] = useState<'LOGIN' | 'SIGNEIN' | null>(null);

	const [login, setlogin] = useState('');
	const [password, setPassword] = useState('');

	const [usual_full_name, setusual_full_name] = useState('');
	const [username, setusername] = useState('');
	const [email, setemail] = useState('');
	const [passwordsigne, setpasswordsigne] = useState('');

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (
			usual_full_name.trim().length === 0 ||
			passwordsigne.trim().length === 0 ||
			username.trim().length === 0 ||
			email.trim().length === 0
		) {
			return toast.error('Please fill all the fields');
		}

		if (
			usual_full_name.trim().length > 100 ||
			passwordsigne.trim().length > 100 ||
			username.trim().length > 100 ||
			email.trim().length > 100
		) {
			return toast.error('TOO LONG');
		}

		if (
			username.trim().length > 20 ||
			username.trim().length < 3 ||
			!/^[a-zA-Z0-9_\-+]+$/.test(username)
		) {
			toast.error('Choose another username');
			return;
		}
		if (username === 'Computer') {
			toast.error('Choose another login');
			return;
		}
		if (passwordsigne.trim().length > 20 || passwordsigne.trim().length < 3) {
			toast.error('Choose another password');
			return;
		}
		if (
			usual_full_name.trim().length > 100 ||
			usual_full_name.trim().length < 3 ||
			!/^[a-zA-Z0-9_\-+ ]+$/.test(usual_full_name)
		) {
			toast.error('Error in full name');
			return;
		}
		if (email.trim().length > 100 || email.trim().length < 3) {
			toast.error('Error in email');
			return;
		}

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/signup`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({
						usual_full_name: usual_full_name.trim(),
						username: username.trim(),
						email: email.trim(),
						password: passwordsigne,
					}),
				},
			);

			const data = await res.json();
			if (data.succes === true) {
				return router.push(`/profile/${data.Id}`);
			} else if (data.succes === false) {
				toast.error(data.message);
			}
		} catch (e) {
			toast.error('Error while signing up');
		}
	};

	const handleLogin = async (e: any) => {
		e.preventDefault();
		if (login.trim().length === 0 || password.trim().length === 0) {
			return toast.error('Please fill all the fields');
		}

		if (
			login.trim().length > 20 ||
			login.trim().length < 3 ||
			!/^[a-zA-Z0-9_\-+]+$/.test(login)
		) {
			toast.error('wrong login');
			return;
		}
		if (password.trim().length > 20 || password.trim().length < 3) {
			toast.error('wrong password');
			return;
		}

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/login`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({
						username: login.trim(),
						password: password,
					}),
				},
			);

			const data = await res.json();

			if (data.succes === true) {
				if (data.Id) {
					return router.push(`/profile/${data.Id}`);
				} else {
					return router.push(`/2FA`);
				}
			} else if (data.succes === false) {
				toast.error(data.message);
				console.log('Error : ', data);
			}
		} catch (e) {
			toast.error('Error while logging in');
		}
	};

	// bg-[#12141A]

	return (
		<div className="w-[100vw] relative overflow-x-hidden ">
			<AppProvider>
				<div className="w-[100vw] hero min-h-screen  ">
					<div className="h-[50vh] absolute top-0 left-0 hero homebackround overflow-hidden"></div>
					<div className="absolute top-1/2 left-0 flex flex-col w-[100vw] items-center justify-center h-[50vh] bg-white overflow-hidden">
						<div className="absolute flex flex-col items-center justify-center w-2/3">
							<p className="mb-2 md:text-md text-sm mt-24 text-[#12141A] font-mono w-2/3 md:mt-10">
								Explore the ultimate Pong gaming hub on our website!
							</p>
							<p className=" mb-2 md:text-md text-sm text-[#12141A] font-mono w-2/3">
								Enjoy classic gameplay with modern features, including one-on-one
								matches and multiplayer modes with integrated chat.
							</p>
							<p className="mb-2 md:text-md text-sm text-[#12141A] font-mono w-2/3">
								All skill levels are welcome in our vibrant community for exciting
								matches and social connections!
							</p>
						</div>
						<Lottie
							animationData={loading}
							className="z-0 w-auto h-aut opacity-70"
							onDOMLoaded={(e) => {
								lottieRef.current?.setSpeed(0.05);
							}}
							lottieRef={lottieRef as any}
						/>
					</div>
					<div className="w-2/3 hero-content text-center text-neutral-content z-10">
						<div className="w-full flex justify-center items-center flex-col bg-white p-8 rounded-lg shadow-2xl">
							<h1 className="  mb-5 md:text-5xl text-3xl font-bold text-[#12141A] font-sans">
								Transcendence
							</h1>
							<p className="text-[#12141A] text-sm font-sans">
								The ultimate pong hub :
							</p>
							<p className="mb-5 text-[#12141A] text-sm font-sans">
								classic gameplay, private chat...
							</p>

							<div className="z-20 m-2  w-52  justify-center items-center">
								<div className=" w-52 flex flex-row justify-center items-cente">
									<motion.div
										layoutId={'LOGIN'}
										onClick={() => setSelectedId('LOGIN')}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
									>
										<div className=" z-50 w-52 text-center flex justify-center flex-row bg-[#292D39] font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-3xl">
											<div className="flex justify-between items-center text-white font-mono">
												Login &nbsp;
												<CiLogin size="25" />
											</div>
										</div>
									</motion.div>
								</div>
							</div>
						</div>
					</div>

					<div className="inline-block absolute left-0 top-[100vh] w-full bg-[#292D39] overflow-hidden">
						<div className="footer w-[100vw] p-10 text-white overflow-hidden md:justify-normal justify-center">
							<div className="md:w-auto w-[50vw] m-0 flex flex-col justify-center items-center ">
								<div className=" w-16 h-16 flex-row justify-center items-center ">
									<Image
										unoptimized={true}
										src={pong}
										alt="Description of the image"
										priority={true}
										width={100}
										height={100}
										sizes=""
										className=""
										style={{ filter: 'invert(100%)' }}
									/>
								</div>
								<div className="text-center flex-col justify-center ">
									<div className="font-serif text-base text-center">Transcendence</div>
									The ultimate pong hub
								</div>
							</div>
							<div className=" md:w-auto w-[50vw] flex flex-col justify-center items-center">
								<div className="footer-title ">Services</div>
								<div className="link link-hover">Live pong games</div>
								<div className="link link-hover">games with IA</div>
								<div className="link link-hover">Private chat</div>
								<div className="link link-hover">Group chat</div>
							</div>
							<div className="md:w-auto w-[50vw] flex flex-col justify-center items-center">
								<div className="footer-title">IT team</div>
								<div className="link link-hover">Mimouni Imad</div>
								<div className="link link-hover">Zakariae Essadqui</div>
								<div className="link link-hover">Marius Wilsch</div>
							</div>
							<div className="md:w-auto w-[50vw]  flex flex-col justify-center items-center">
								<div className="footer-title ">Social</div>
								<div className="imad flex flex-row ">
									<Link href={'https://github.com/imadmi'} target="_blank">
										<FaGithub size="20" className=" text-white mr-3" />
									</Link>
									<Link
										href={'https://www.linkedin.com/in/imadmimouni/'}
										target="_blank"
									>
										<FaLinkedin size="20" className=" text-white" />
									</Link>
								</div>
								<div className="zaki flex flex-row ">
									<Link href={''} target="_blank">
										<FaGithub size="20" className=" text-white mr-3" />
									</Link>
									<Link href={''} target="_blank">
										<FaLinkedin size="20" className=" text-white" />
									</Link>
								</div>
								<div className="marius flex flex-row ">
									<Link href={''} target="_blank">
										<FaGithub size="20" className=" text-white mr-3" />
									</Link>
									<Link href={''} target="_blank">
										<FaLinkedin size="20" className=" text-white" />
									</Link>
								</div>
							</div>
						</div>
						<div className="flex items-center justify-center px-10 py-4 border-t text-white border-gray-400 text-sm">
							<div>Copyright © 2024 - All right reserved</div>
						</div>
					</div>

					<AnimatePresence>
						{selectedId === 'LOGIN' && (
							<div className="w-screen max-w-screen h-screen flex justify-center items-center backdrop-blur-md z-20 overflow-hidden">
								<div className="shadow-lg relative md:w-1/2  w-4/5  z-20 flex justify-center items-center bg-slate-800 bg-opacity-20 border-2 border-gray-800 rounded-2xl">
									<button
										onClick={() => setSelectedId(null)}
										className="bg-black bg-opacity-20 absolute top-3 right-3 rounded-full"
									>
										<IoClose size="30" className="text-gray-800 " />
									</button>
									<motion.div
										layoutId={selectedId}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
									>
										<div className="flex justify-center items-center ">
											<div className="z-20">
												<div className="mt-14">
													<div className="flex justify-center items-center">
														<form
															onSubmit={handleLogin}
															className="rounded px-8 pt-6 pb-8 mb-4"
														>
															<div className="mb-4">
																<label
																	className="block text-black text-sm font-bold mb-2"
																	htmlFor="login"
																>
																	User name
																</label>
																<input
																	className=" border-gray-900 shadow bg-slate-100 bg-opacity-10 placeholder-gray-800 appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:border-2 focus:border-green-400 focus:shadow-outline"
																	id="login"
																	type="text"
																	placeholder="Login"
																	name="login"
																	value={login}
																	onChange={(e) => setlogin(e.target.value)}
																/>
															</div>

															<div className="mb-6">
																<label
																	className="block text-black text-sm font-bold mb-2"
																	htmlFor="password"
																>
																	Password
																</label>
																<input
																	className="border-gray-900 shadow bg-slate-100 bg-opacity-10 placeholder-gray-800  appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:border-2 focus:border-green-400  focus:outline-none focus:shadow-outline"
																	id="password"
																	type="password"
																	placeholder="Password"
																	name="password"
																	value={password}
																	onChange={(e) => setPassword(e.target.value)}
																/>
															</div>
															<div className="flex items-center justify-center  ">
																<button
																	className="bg-blue-500 rounded-3xl w-full hover:bg-blue-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
																	type="submit"
																>
																	Log in
																</button>
															</div>
															<div className="mt-10 flex items-center justify-center  ">
																<Link
																	href={`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/42/callback`}
																	className=" w-full  flex justify-center items-center"
																>
																	<div className="w-full rounded-3xl flex justify-center items-center bg-zinc-50 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 ">
																		Log in with &nbsp;
																		<Image
																			src={logo}
																			alt="42 logo"
																			width={25}
																			className="inline-block mr-2"
																		/>
																	</div>
																</Link>
															</div>
															<div className="mt-2 w-full flex  justify-center items-center">
																<div className="cursor-pointer w-full flex flex-row  justify-between items-center">
																	<motion.div
																		layoutId={'SIGNEIN'}
																		onClick={() => {
																			setSelectedId(null);
																			setTimeout(() => {
																				setSelectedId('SIGNEIN');
																			}, 500);
																		}}
																		initial={{ opacity: 0 }}
																		animate={{ opacity: 1 }}
																		exit={{ opacity: 0 }}
																		className="w-full"
																	>
																		<div className="w-full flex items-center justify-center rounded-3xl bg-zinc-50 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 text-center">
																			Sign in
																		</div>
																	</motion.div>
																</div>
															</div>
														</form>
													</div>
												</div>
											</div>
										</div>
									</motion.div>
								</div>
							</div>
						)}
						{selectedId === 'SIGNEIN' && (
							<div className="w-screen  h-screen flex justify-center items-center backdrop-blur-md z-20 overflow-hidden">
								<div className="shadow-lg relative md:w-1/2  w-4/5  z-20 flex justify-center items-center bg-slate-800 bg-opacity-20 border-2 border-gray-800 rounded-2xl ">
									<button
										onClick={() => setSelectedId(null)}
										className="bg-black bg-opacity-20 absolute top-3 right-3 rounded-full"
									>
										<IoClose size="30" className="text-gray-800 " />
									</button>
									<motion.div
										layoutId={selectedId}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
									>
										<div className="flex justify-center items-center ">
											<div className="z-20">
												<div className="mt-14">
													<div className="flex justify-center items-center">
														<form
															onSubmit={handleSubmit}
															className="rounded px-8 pt-6 pb-8 mb-4"
														>
															<div className="mb-4">
																<label
																	className=" block text-black text-sm font-bold mb-2"
																	htmlFor="username"
																>
																	Full Name
																</label>
																<input
																	className="border-gray-900 shadow bg-slate-100  appearance-none border  placeholder-gray-800  rounded w-full py-2 px-3 bg-opacity-10  text-black leading-tight focus:border-2 focus:border-green-400  focus:outline-none focus:shadow-outline"
																	id="username"
																	type="text"
																	placeholder="Full name"
																	name="username"
																	value={usual_full_name}
																	onChange={(e) => setusual_full_name(e.target.value)}
																/>
															</div>
															<div className="mb-4">
																<label
																	className="block text-black text-sm font-bold mb-2"
																	htmlFor="login"
																>
																	User name
																</label>
																<input
																	className=" border-gray-900 shadow bg-slate-100 bg-opacity-10 placeholder-gray-800 appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:border-2 focus:border-green-400  focus:outline-none focus:shadow-outline"
																	id="login"
																	type="text"
																	placeholder="User name"
																	name="login"
																	value={username}
																	onChange={(e) => setusername(e.target.value)}
																/>
															</div>
															<div className="mb-4">
																<label
																	className="block text-black text-sm font-bold mb-2"
																	htmlFor="email"
																>
																	Email
																</label>
																<input
																	className="border-gray-900 shadow bg-slate-100  bg-opacity-10  placeholder-gray-800  appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:border-2 focus:border-green-400  focus:outline-none focus:shadow-outline"
																	id="email"
																	type="email"
																	placeholder="Email"
																	name="email"
																	value={email}
																	onChange={(e) => setemail(e.target.value)}
																/>
															</div>
															<div className="mb-6">
																<label
																	className="block text-black text-sm font-bold mb-2"
																	htmlFor="password"
																>
																	Password
																</label>
																<input
																	className="border-gray-900 shadow bg-slate-100 bg-opacity-10 placeholder-gray-800  appearance-none border rounded w-full py-2 px-3 text-black mb-3 leading-tight focus:border-2 focus:border-green-400  focus:outline-none focus:shadow-outline"
																	id="password"
																	type="password"
																	placeholder="Password"
																	name="password"
																	value={passwordsigne}
																	onChange={(e) => setpasswordsigne(e.target.value)}
																/>
															</div>
															<div className="flex items-center justify-center  ">
																<button
																	className="bg-blue-500 rounded-3xl w-full hover:bg-blue-700 text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline"
																	type="submit"
																>
																	Sign Up
																</button>
															</div>
															<div className="mt-10 flex items-center justify-center  ">
																<Link
																	href={`${process.env.NEXT_PUBLIC_API_URL}:3001/auth/42/callback`}
																	className="  w-full  flex justify-center items-center"
																>
																	<div className="rounded-3xl w-full flex justify-center items-center bg-zinc-50 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 ">
																		Log in with &nbsp;
																		<Image
																			src={logo}
																			alt="42 logo"
																			width={25}
																			className="inline-block mr-2"
																		/>
																	</div>
																</Link>
															</div>
															<div className="mt-2  w-full flex  justify-center items-center">
																<div className="cursor-pointer w-full flex flex-row justify-between items-center">
																	<motion.div
																		layoutId={selectedId}
																		onClick={() => {
																			setSelectedId(null);
																			setTimeout(() => {
																				setSelectedId('LOGIN');
																			}, 500);
																		}}
																		className="w-full"
																		initial={{ opacity: 0 }}
																		animate={{ opacity: 1 }}
																		exit={{ opacity: 0 }}
																	>
																		<div className="w-full flex items-center justify-center rounded-3xl bg-zinc-50 font-sans hover:bg-gray-400 text-black font-bold py-2 px-4 ">
																			Login
																		</div>
																	</motion.div>
																</div>
															</div>
														</form>
													</div>
												</div>
											</div>
										</div>
									</motion.div>
								</div>
							</div>
						)}
						{selectedId === null && <div></div>}
					</AnimatePresence>
				</div>

				<Toaster />
			</AppProvider>
		</div>
	);
}
