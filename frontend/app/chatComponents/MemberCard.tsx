import Cookies from 'universal-cookie';
import { useAppContext } from '../AppContext';
import { PiFlagBannerLight } from 'react-icons/pi';
import EditMemberShip from './EditMemberShip';
import Link from 'next/link';
import { CgProfile } from 'react-icons/cg';
import Image from 'next/image';
import { GiTatteredBanner } from "react-icons/gi";


const MemberCard = (props: any) => {
	const context = useAppContext();
	const { member, currentMember } = props;
	const {
		memberId,
		intraId,
		channelId,
		Avatar,
		login,
		isOwner,
		isModerator,
		isBanned,
		isMuted,
		mutedTime,
		joined_at,
	} = member;
	const handleBanning = () => {
		if (context.socket) {
			const cookie = new Cookies();
			const jwt = cookie.get('jwt');
			context.socket.emit('updateChannelUser', {
				jwt,
				memberId,
				info: {
					userPrivilige: isModerator,
					banning: !isBanned,
					Muting: { action: isMuted, time: mutedTime },
				},
			});
		}
	};
	const Ban = () => (
		<div className=" flex flex-row space-x-5">
			{
				!isBanned ?
				(<PiFlagBannerLight
				onClick={() => {
					handleBanning();
				}}
				className="text-white w-6 h-6 transform transition-transform hover:scale-150"
			/>) :
			(< GiTatteredBanner
				onClick={() => {
					handleBanning();
				}}
				className="text-white w-6 h-6 transform transition-transform hover:scale-150"
			/>) 
		}
			<EditMemberShip member={member} currentMember={currentMember} />
		</div>
	);
	return (
		<div className="flex flex-row justify-between space-y-2  text-xs p-3 hover:bg-gray-800 rounded w-full bg-black">
			<div className="flex flex-row  ml-0">
				<Image
					width={50}
					height={50}
					src={member?.Avatar}
					alt="My profile"
					className="w-10 sm:w-10 h-10 sm:h-10 rounded-full"
					unoptimized={true}
					onError={(e: any) => {
						e.target.onerror = null;
						e.target.src =
							'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
					}}
				/>
				<span className="p-2 text-white text-center">{member?.login}</span>
			</div>
			<div>
				{currentMember?.isOwner || currentMember?.isModerator ? (
					<Ban />
				) : (
					<Link
						href={`${process.env.NEXT_PUBLIC_API_URL}:3000/profile/${member.intraId}`}
					>
						<CgProfile className="text-white w-6 h-6 transform transition-transform hover:scale-150 " />
					</Link>
				)}
			</div>
		</div>
	);
};

export default MemberCard;
