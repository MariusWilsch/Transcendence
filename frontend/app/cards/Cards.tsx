'use client';
import Card1Picture from '../assets/images/card1.png';
import Card2Picture from '../assets/images/card2.png';
import Image from 'next/image';
import Link from 'next/link';

export const Card = ({ img, btnText, title, desc }: any) => {
	return (
		<div className="card bg-base-200 shadow-sm hover:shadow-accent rounded-xl boxTransform">
			<figure>
				<Image src={img} alt="Pre-configured game" />
			</figure>
			<div className="card-body text-left">
				<h2 className="card-title">{title}</h2>
				<p className="">{desc}</p>
				<div className="card-actions justify-center">
					<Link href={'/steps'}>
						<button className="btn btn-primary">{btnText}</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

const Cards = () => {
	//* I want these cards to be clickable and redirect to the steps page
	//! The cards should wrap to the next line if the screen is too small
	//! I don't know how to specify when the cards should wrap to the next line
	return (
		<div className="flex flex-wrap justify-center items-center gap-12">
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
