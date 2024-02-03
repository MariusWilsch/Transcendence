import Image from 'next/image';
import { useAppContext } from '../AppContext';

export const SingleMessageSent = ({ message }: any) => {
	const context = useAppContext();
	return (
		<div className="flex items-end justify-end p-2 my-1">
			<div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
				<div>
					<span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
						{message}
					</span>
				</div>
			</div>
			<Image
				width={24}
				height={24}
				src={context.userData?.Avatar}
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
