import Cookies from 'universal-cookie';
import { User, useAppContext } from '../AppContext';
import Link from 'next/link';
import Image from 'next/image';

const FriendsCard = () => {
	const context = useAppContext();
	const users = context.friendsData.friends;
	const roomIdExtractor = (user1: string, user2: string) => {
		return parseInt(user1) > parseInt(user2) ? user1 + user2 : user2 + user1;
	};
	const creatRoomEvent = (user: User) => {
		context.setRecipientLogin(user.intraId);
		const cookie = new Cookies();
		const jwt = cookie.get('jwt');
		context.socket?.emit('createPrivateRoom', { jwt, user2: user.intraId });
	};
	return (
		<div className="flex flex-row overflow-x-auto  md:overflow-scroll ">
			{users.map((user: User, index: number) => (
				<Link
					onClick={() => creatRoomEvent(user)}
					href={`${process.env.NEXT_PUBLIC_API_URL}:3000/chat/${roomIdExtractor(
						context.userData?.intraId,
						user.intraId,
					)}`}
					key={index}
				>
					<div
						key={index}
						className="flex flex-row items-center text-xs p-3  my-1 hover:bg-gray-800 rounded "
					>
						<div className=" flex flex-col text-white  max-w-xs mx-2 order-2 items-start">
							<Image
								width={50}
								height={50}
								src={user.Avatar}
								alt="My profile"
								className="w-10 sm:w-10 h-10 sm:h-10 rounded-full"
								unoptimized={true}
								onError={(e: any) => {
									e.target.onerror = null;
									e.target.src =
										'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
								}}
							/>
							<div>
								<span className="hidden sm:block">{user?.login}</span>
							</div>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
};

export default FriendsCard;
