import { Providers } from '@/app/gamelobby/GlobalRedux/provider';

const Content = ({ children }: any) => {
	return (
		<div className="flex flex-1 flex-col justify-center rounded-tl-2xl bg-base-100 h-full shadow-lg">
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
		<div className="w-full">
			<Providers>
				<Content>{children}</Content>
			</Providers>
		</div>
	);
}
