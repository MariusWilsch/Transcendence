import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import { Providers } from '@/app/gamelobby/GlobalRedux/provider';

const Content = ({ children }: any) => {
	return (
		<div className="flex flex-1 flex-col justify-center -mt-1 -ml-1 rounded-tl-2xl bg-base-100 h-full  shadow-lg">
			{children}
		</div>
	);
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<Content>{children}</Content>
				</Providers>
			</body>
		</html>
	);
}
