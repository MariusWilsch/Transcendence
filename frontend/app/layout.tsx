'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider, User } from './AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

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
					<AppProvider>
						<motion.div
							initial={{ opacity: 0, y: -100 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							<AnimatePresence>{children}</AnimatePresence>
						</motion.div>
					</AppProvider>
				</body>
			) : (
				<body className={inter.className}>
					<AppProvider>
						<motion.div
							initial={{ opacity: 0, y: -100 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
						>
							<AnimatePresence>
								<div className=" min-h-screen w-full bg-[#12141A] relative ">
									<div className="z-0 absolute w-auto h-auto inset-0 mt-80"></div>

									<Navbar />
									<div className="flex ">
										<Sidebar />
										{children}
									</div>
								</div>
							</AnimatePresence>
						</motion.div>
					</AppProvider>
				</body>
			)}
		</html>
	);
}
