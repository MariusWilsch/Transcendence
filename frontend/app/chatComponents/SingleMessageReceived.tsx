import Image from 'next/image';

export const SingleMessageReceived = (props: any) => {
	const { message, recipient } = props;
	return (
		<div className="flex items-end p-2 my-1">
			<div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
				<div>
					<span className="max-w-xs px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
						{message}
					</span>
				</div>
			</div>
			<Image
				width={24}
				height={24}
				src={recipient?.Avatar}
				alt="My profile"
				className="w-6 h-6 rounded-full order-1"
				unoptimized={true}
				onError={(e: any) => {
					e.target.onerror = null;
					e.target.src =
						'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
				}}
			/>
		</div>
	);
};
