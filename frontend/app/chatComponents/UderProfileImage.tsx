import Image from 'next/image';

const UserProfileImage = ({
	status,
	isProfileOwner,
	src,
	intraId,
}: {
	status: string | undefined;
	isProfileOwner: boolean;
	src: string;
	intraId: string | undefined;
}) => {
	return (
		<div className="flex flex-col items-center justify-center p-6 ">
			<div
				className=" flex justify-center items-center border-white border-y-4 border-x-4 rounded-full"
				style={{ position: 'relative', display: 'inline-block' }}
			>
				<Image
					src={src}
					alt="profile picture"
					width={120}
					height={120}
					className="rounded-full border-2 border-black w-40 h-40  "
					unoptimized={true}
					onError={(e: any) => {
						e.target.onerror = null;
						e.target.src =
							'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
					}}
				/>
			</div>
		</div>
	);
};

export default UserProfileImage;
