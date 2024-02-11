'use client';
import pic1 from '@/public/static/images/playInstantGame.png';
import pic2 from '@/public/static/images/customizeGame.png';
import Image, { StaticImageData } from 'next/image';
import React, { useEffect } from 'react';
import useStartGame from '../hooks/useStartGame';
import { useRouter } from 'next/navigation';
import { Modal } from '.';
import { useSelector } from 'react-redux';
import { RootState } from '../GlobalRedux/store';

type CardProps = {
	img: StaticImageData;
	alt: string;
	btnText: string;
	title: string;
	desc: string;
	onClick: () => void;
};

export const Card: React.FC<CardProps> = ({
	img,
	alt,
	btnText,
	title,
	desc,
	onClick,
}) => {
	return (
		<div
			onClick={onClick}
			className="card bg-base-200 rounded-xl boxTransform w-3/5 md:w-[55%] lg:w-2/5 mb-4 sm:max-h-[40vh] lg:max-h-[60vh]"
		>
			<figure className="">
				<Image
					src={img}
					alt={alt}
					layout="responsive"
					objectFit="cover"
					unoptimized={true}
					onError={(e: any) => {
						e.target.onerror = null;
						e.target.src =
							'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
					}}
				/>
			</figure>
			<div className="card-body text-left max-h-[60%]  md:py-2 lg:py-8">
				<h2 className="card-title sm:text-base lg:text-xl">{title}</h2>
				<p>{desc}</p>
				<div className="card-actions justify-center mt-4">
					<button className="btn btn-xs sm:btn-sm lg:btn-md  btn-primary btn-wide text-white bg-primary hover:border-2 hover:bg-transparent hover:border-accent/40 shadow transition duration-300 ease-in-out hover:shadow-lg">
						{btnText}
					</button>
				</div>
			</div>
		</div>
	);
};

const Cards: React.FC = () => {
	const { pushGame } = useStartGame();
	const router = useRouter();
	const isConnected = useSelector(
		(state: RootState) => state.connection.isConnected,
	);

	return (
		<>
			<div className="flex flex-wrap justify-center items-center py-6 gap-12 sm:gap-4 md:gap-6 lg:gap-12 h-full">
				<Card
					img={pic1}
					alt={'Play now!'}
					btnText={'Play now!'}
					title={'Play now!'}
					desc={
						'Click here to play the game! You will use your Mouse to move the paddle and play against another player!'
					}
					onClick={() => pushGame(isConnected)}
				/>
				<Card
					img={pic2}
					alt={'Customize the game'}
					btnText={'Customize the game'}
					title={'Customize the game'}
					desc={
						'Click here to customize the game! You can choose to play against a friend or the computer and much more!'
					}
					onClick={() =>
						router.push(`${process.env.NEXT_PUBLIC_API_URL}:3000/gamelobby/steps`)
					}
				/>
			</div>
			<Modal />
		</>
	);
};

export default Cards;
