const Content = ({ children }: any) => {
	return (
		<div className="flex flex-1 flex-col justify-center bg-base-100 h-full shadow-lg">
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
		<div className="w-full text-base text-white">
			<Content>{children}</Content>
		</div>
	);
}
