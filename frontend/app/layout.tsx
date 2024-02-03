'use client';

import './globals.css';
import { AppProvider } from './AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Providers } from '@/app/gamelobby/GlobalRedux/provider';


export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		<html lang="en">
			{pathname === '/' || pathname === '/2FA' ? (
				<body>
					<Providers>
						<AppProvider>
							<motion.div
								initial={{ opacity: 0, y: -100 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								<AnimatePresence>{children}</AnimatePresence>
							</motion.div>
						</AppProvider>
					</Providers>
				</body>
			) : (
				<body>
					<Providers>
						<AppProvider>
							<motion.div
							className='overflow-y-scroll no-scrollbar'
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
						</AppProvider>
					</Providers>
				</body>
			)}
		</html>
	);
}
