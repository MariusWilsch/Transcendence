'use client';
import Card1Picture from '../assets/images/card1.png';
import Card2Picture from '../assets/images/card2.png';

import Image from 'next/image';

export const Card = ({ img, btnText, title, desc }: any) => {
	return (
		<div className="card bg-base-200 shadow-sm hover:shadow-accent sm:w-[60vw] sm:max-h-[60vh] md:w-[40%] rounded-xl boxTransform overflow-y-auto">
			<figure>
				<Image src={img} alt="Pre-configured game" />
			</figure>
			<div className="card-body text-left">
				<h2 className="card-title">{title}</h2>
				<p className="">{desc}</p>
				<div className="card-actions justify-center">
					<button className="btn btn-primary">{btnText}</button>
				</div>
			</div>
		</div>
	);
};

const Cards = () => {
	return (
		<div className="flex flex-wrap justify-center items-center gap-12 max-h-[80%]">
			<Card
				img={Card1Picture}
				btnText={'Play now!'}
				title={'Play now!'}
				desc={
					'This game is pre-configured so all you have to do is press play!'
				}
			/>
			<Card
				img={Card2Picture}
				btnText={'Customize the game'}
				title={'Customize the game'}
				desc={'Here you can customize your game to your liking!'}
			/>
		</div>
	);
};

export default Cards;
