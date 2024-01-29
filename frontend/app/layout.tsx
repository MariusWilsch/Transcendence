'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider, User } from './AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { Providers } from '@/app/gamelobby/GlobalRedux/provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<User | null>(null);
	const pathname = usePathname();

	return (
		<html lang="en">
			{pathname === '/' ? (
				<body className={inter.className}>
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
				<body className={inter.className}>
					<Providers>
						<MantineProvider>
							<AppProvider>
								<motion.div
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
						</MantineProvider>
					</Providers>
				</body>
			)}
		</html>
	);
}
