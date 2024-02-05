'use client';

import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState, useRef } from 'react';
import { useAppContext, User } from '../../AppContext';
import { io, Socket } from 'socket.io-client';
import Cookies from 'universal-cookie';
import { Loading } from '../../components/Loading';
import { Achievements } from '../../components/Achievements';
import { Gamehistory } from '../../components/Gamehistory';
import { UserDetailsCard } from '../../components/UserDetailsCard';
import { UserProfileImage } from '../../components/UserProfileImage';
import { TwoFactorAuth } from '../../components/TwoFactorAuth';
import { Friend } from '../../components/Friend';

export default function Profile(params: any) {
	const {
		user,
		setUser,
		isDivVisible,
		toggleDivVisibility,
		setDivVisible,
		setisSidebarVisible,
	} = useAppContext();

	const [socket, setsocket] = useState<Socket | null>(null);

	const [userFromRoutId, setuserFromRoutId] = useState<User | undefined>(
		undefined,
	);
	const [isProfileOwner, setIsProfileOwner] = useState<boolean>(false);

	useEffect(() => {
		setisSidebarVisible(window.innerWidth > 768);
	}, []);

	const addLogin = (isRegistred: any) => {
		if (isRegistred === false && isProfileOwner === true) {
			toggleDivVisibility();
			toast.success('🌟 Please update your nickname and avatar.', {
				style: {
					border: '1px solid #713200',
					padding: '16px',
					color: '#713200',
				},
				iconTheme: {
					primary: '#713200',
					secondary: '#FFFAEE',
				},
			});
		}
	};

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
	}, [user?.login, isProfileOwner]);

	const getUserFromRoutId = async () => {
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}:3001/users/${params.params.intraId}`,
				{
					method: 'GET',
					credentials: 'include',
				},
			);

			if (!response.ok) {
				toast.error('User not found');
				return;
			}
			const contentType = response.headers.get('content-type');

			if (contentType && contentType.includes('application/json')) {
				var data = await response.json();
				if (data.succes === false) {
					return;
				}
				if (data.data !== null && data.data !== undefined) {
					setuserFromRoutId(data.data);
				}
			} else {
				toast.error('User not found');
			}
		} catch (error: any) {
			const msg = 'Error during login' + error.message;
			toast.error(msg);
			console.error('Error during login:', error);
		}
	};

	useEffect(() => {
		getUserFromRoutId();
	}, []);

	useEffect(() => {
		if (params.params.intraId === user?.intraId) {
			setIsProfileOwner(true);
		}
	}, [user]);

	useEffect(() => {
		addLogin(user?.isRegistred);
	}, [user?.isRegistred, isProfileOwner]);

	const context = useAppContext();

	const createsocket = () => {
		const handleClientsConnection = `${process.env.NEXT_PUBLIC_API_URL}:3002/handleClientsConnection`;

		const cookies = new Cookies();
		const newSocket = io(handleClientsConnection, {
			auth: { jwt: cookies.get('jwt') },
		});

		setsocket(newSocket);
		context.setNotifSocket(newSocket);
	};

	useEffect(() => {
		if (!socket) {
			createsocket();
		}
	}, []);

	useEffect(() => {
		const listenForEvents = () => {
			if (socket !== null) {
				socket.on('update', () => {
					getUserFromRoutId();
				});
			}
		};

		if (socket) {
			listenForEvents();
			return () => {
				socket.off('update');
			};
		}
	}, [socket]);

	useEffect(() => {
		if (isProfileOwner === false) {
			setDivVisible(false);
		}
	}, [user]);

	if (!userFromRoutId) {
		return (
			<>
				<div className="flex-1 overflow-y-auto">
					<Loading />
				</div>
			</>
		);
	}

	let Login = 'Login';
	let intraId = '';
	let isTfaEnabled = false;
	let IntraPic = '/gon.jpg';

	if (isProfileOwner && user !== null) {
		Login = user.login;
		intraId = user.intraId;
		isTfaEnabled = user.isTfaEnabled;
		IntraPic = user.Avatar;
	} else {
		Login = userFromRoutId?.login;
		intraId = userFromRoutId?.intraId;
		isTfaEnabled = userFromRoutId?.isTfaEnabled;
		IntraPic = userFromRoutId?.Avatar;
	}

	return (
		<div className="w-full  flex justify-center overflow-y-scroll no-scrollbar">
			<div className="z-10 relative flex-1 ">
				<UserProfileImage
					status={userFromRoutId?.status}
					isProfileOwner={isProfileOwner}
					src={IntraPic}
					intraId={intraId}
					userFromRoutId={userFromRoutId}
				/>
				<div
					className={`${isDivVisible ? 'md:mt-28 mt-10' : 'md:mt-24 mt-12'} p-10 `}
				>
					<UserDetailsCard value={Login} intraId={intraId} />
					{user !== null ? (
						<Friend
							isProfileOwner={isProfileOwner}
							userId={user?.intraId}
							friendId={params.params.intraId}
							inChat={false}
						/>
					) : (
						<div className="flex items-center justify-center text-gray-400">
							<div className="skeleton bg-[#12141A] bg-opacity-40 pr-10 pl-10 text-slate-400">
								Loading...
							</div>
						</div>
					)}
					<TwoFactorAuth intraId={intraId} isTfa={isTfaEnabled} />

					<Gamehistory intraId={intraId} />
					<Achievements intraId={intraId} />
				</div>
			</div>
			<Toaster />
		</div>
	);
}
