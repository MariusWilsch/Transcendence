'use client';

import './globals.css';
import '@mantine/core/styles.css';
import { AppProvider, User, useAppContext } from './AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Providers } from '@/app/gamelobby/GlobalRedux/provider';
import { MantineProvider } from '@mantine/core';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();

	const checkJwtCookie = async () => {
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
				router.push('/');
			}
			if (data.data !== null && data.data !== undefined) {
			}
		} catch (error: any) {
			router.push('/');
		}
	};

	useEffect(() => {
		checkJwtCookie();
	}, [pathname]);

	return (
		<html lang="en">
			{pathname === '/' || pathname === '/2FA' ? (
				<body>
					<Providers>
						<AppProvider>
							<MantineProvider>
								<motion.div
									initial={{ opacity: 0, y: -100 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
								>
									<AnimatePresence>{children}</AnimatePresence>
								</motion.div>
							</MantineProvider>
						</AppProvider>
					</Providers>
				</body>
			) : (
				<body>
					<Providers>
						<AppProvider>
							<MantineProvider>
								<motion.div
									className="overflow-y-scroll no-scrollbar"
									initial={{ opacity: 0, y: -100 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.3 }}
								>
									<AnimatePresence>
										<div className=" min-h-screen w-screen bg-[#12141A] relative overflow-x-hidden">
											<div className="z-0 absolute w-auto h-auto overflow-hidden inset-0 mt-80"></div>

											<Navbar />
											<div className="flex ">
												<Sidebar />
												{children}
											</div>
										</div>
									</AnimatePresence>
								</motion.div>
							</MantineProvider>
						</AppProvider>
					</Providers>
				</body>
			)}
		</html>
	);
}
