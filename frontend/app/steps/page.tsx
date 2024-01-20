'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { startConnection } from '@/app/GlobalRedux/features';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../GlobalRedux/store';
import Image, { StaticImageData } from 'next/image';
//* Images
import playAgainstAI2 from '@/public/static/images/playAgainstAI2.png';
import playAgainstHuman from '@/public/static/images/playAgainstHuman.png';
import useMouse from '@/public/static/images/useMouse.png';
import useKeyboard from '@/public/static/images/useKeyboard.png';
import orginialMapSmall from '@/public/static/images/pongOld.jpg';
import standardMap from '@/public/static/images/standardMap.png';

//* Helper components
//! Add this to it's own file, maybe /components/*
//? Where should I put theses components?

const Input = ({ ariaLabel }: { ariaLabel: string }) => {
	return (
		<input
			className="join-item btn text-white bg-transparent border-0 border-r border-slate-500/40"
			type="radio"
			name="options"
			aria-label={ariaLabel}
			// onChange={handleInputChange}
			// style={{ background: 'transparent' }}
		/>
	);
};

const JoinedButtons = () => {
	return (
		<>
			<div className="join">
				<Input ariaLabel="Easy" />
				<Input ariaLabel="Medium" />
				<Input ariaLabel="Hard" />
			</div>
		</>
	);
};

const Instructions = () => {
	return (
		<div className="flex flex-col text-left">
			<span>
				Press <kbd className="kbd kbd-sm text-white">W</kbd>to move your paddle
				up.
			</span>
			<span>
				Press <kbd className="kbd kbd-sm text-white">A</kbd> to move your paddle
				down.
			</span>
		</div>
	);
};

type CardOverlayProps = {
	title: string;
	desc: string;
	img: StaticImageData;
	currentStep: number;
	handleClick: () => void;
};

const CardOverlay = ({
	title,
	desc,
	img,
	currentStep,
	handleClick,
}: CardOverlayProps) => {
	return (
		<>
			<div
				className="card shadow-xl image-full boxTransform w-[60%] h-[80%]"
				onClick={handleClick}
			>
				<figure>
					<Image src={img} alt="Pre-configured game" />
				</figure>
				<div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl "></div>
				<div className="card-body items-center justify-center">
					<h2 className="card-title ">{title}</h2>
					<div>{desc}</div>
					<div className="card-actions">
						{currentStep === 1 && <JoinedButtons />}
						{currentStep === 2 && <Instructions />}
					</div>
				</div>
			</div>
		</>
	);
};

const Modal = () => {
	//? How do I center "Cancel Matchmaking" button
	//! I need to remove the user from the lobby if the cancels matchmaking
	return (
		<dialog id="modal1" className="modal">
			<div className="modal-box text-left">
				<h3 className="font-bold text-lg flex items-end">
					Searching for a game{' '}
					<span className="ml-2 loading loading-dots loading-md"></span>
				</h3>
				<p className="py-4">
					Press ESC key or click the button to cancel the matchmaking.
				</p>
				<div className="modal-action">
					<form method="dialog">
						<button className="btn btn-wide">Cancel Matchmaking</button>
					</form>
				</div>
			</div>
			<form method="dialog" className="modal-backdrop">
				<button>close</button>
			</form>
		</dialog>
	);
};

//* Actual steps

const Step1 = ({ setStep }: any) => {
	//! Divider is taking up to much width on wrapped Cards
	//! The text on the right card  is a bit hard to read
	//! How can I make the buttons a required field when selecting AI
	return (
		<>
			<div className="flex flex-col w-full lg:flex-row items-center gap-8">
				<CardOverlay
					title={'Play against AI'}
					desc={'Sum hipster ipsum here'}
					img={playAgainstAI2}
					currentStep={1}
					handleClick={() => setStep(2)}
				/>
				<div className="lg:divider lg:divider-horizontal hidden">OR</div>
				<CardOverlay
					title={'Play against other players'}
					desc={'Sum hipster ipsum here'}
					img={playAgainstHuman}
					currentStep={0}
					handleClick={() => setStep(2)}
				/>
			</div>
		</>
	);
};

const Step2 = ({ setStep }: any) => {
	//! Divider is taking up to much width on wrapped Cards
	return (
		<>
			<div className="flex flex-col w-full lg:flex-row items-center gap-8">
				<CardOverlay
					title={'Play using your mouse'}
					desc={'Sum hipster ipsum here'}
					img={useMouse}
					currentStep={0}
					handleClick={() => setStep(3)}
				/>
				<div className="lg:divider lg:divider-horizontal hidden">OR</div>
				<CardOverlay
					title={'Play using your keyboard'}
					desc={''}
					img={useKeyboard}
					currentStep={2}
					handleClick={() => setStep(3)}
				/>
			</div>
		</>
	);
};

// const Step3 = () => {
// 	//! I need to zoom out a little on the picture
// 	//! Just look at it lol, there is much to be done there
// 	const router = useRouter();
// 	const dispatch = useDispatch();
// 	const push = useSelector(
// 		(state: RootState) => state.connection.isGameStarted,
// 	);

// 	const handleStartGame = () => {
// 		const modal = document.getElementById('modal1') as HTMLDialogElement;
// 		modal?.showModal();
// 		dispatch(startConnection());
// 	};

// 	useEffect(() => {
// 		if (push) {
// 			router.push('/game');
// 		}
// 	}, [push, router]);

// 	return (
// 		<>
// 			<div className="diff aspect-[16/9] max-w-[80%] max-h-[40%] mx-auto rounded-xl ">
// 				<div className="diff-item-1">
// 					{/* <img
// 						alt="daisy"
// 						src="https://daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a.jpg"
// 					/> */}
// 					<Image src={orginialMapSmall} alt="Map Choice 1" />
// 				</div>
// 				<div className="diff-item-2">
// 					{/* <img
// 						alt="daisy"
// 						src="https://daisyui.com/images/stock/photo-1560717789-0ac7c58ac90a-bw.jpg"
// 					/> */}
// 				</div>
// 				<div className="diff-resizer"></div>
// 			</div>
// 			<button className="btn btn-accent mt-8" onClick={handleStartGame}>
// 				START A GAME
// 			</button>
// 			<Modal />
// 		</>
// 	);
// };

const Step3 = () => {
	//! I need to zoom out a little on the picture
	//! Just look at it lol, there is much to be done there
	const router = useRouter();
	const dispatch = useDispatch();
	const push = useSelector(
		(state: RootState) => state.connection.isGameStarted,
	);

	const handleStartGame = () => {
		const modal = document.getElementById('modal1') as HTMLDialogElement;
		modal?.showModal();
		dispatch(startConnection());
	};

	useEffect(() => {
		if (push) {
			router.push('/game');
		}
	}, [push, router]);

	return (
		<>
			<div className="flex gap-x-4">
				<div className="card w-4/5 bg-base-100 shadow-xl image-full">
					<figure>
						<Image src={standardMap} alt="Map Choice !" />
					</figure>
					<div className="card-body">
						<h2 className="card-title">Map 1</h2>
						<p></p>
					</div>
				</div>
				<div className="card w-4/5 bg-base-100 shadow-xl image-full">
					<figure>
						<Image src={orginialMapSmall} alt="Map Choice !" />
					</figure>
					<div className="card-body">
						<h2 className="card-title">Map 2</h2>
						<p></p>
					</div>
				</div>
			</div>

			<button className="btn btn-accent mt-8" onClick={handleStartGame}>
				START A GAME
			</button>
			<Modal />
		</>
	);
};
const StepsList: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(1);

	return (
		<div className="flex pt-4 flex-col items-center gap-x-12 h-full justify-between">
			<ul className="steps steps-horizontal w-[60%] pt-4">
				<li
					className={`step ${
						currentStep >= 1 ? 'step-accent' : ''
					} text-lg font-bold`}
				>
					<div className="pt-2">Select Game Type</div>
				</li>
				<li
					className={`step ${
						currentStep >= 2 ? 'step-accent' : ''
					} text-lg font-bold`}
				>
					<div className="pt-2">Select Input Controls</div>
				</li>
				<li
					className={`step ${
						currentStep >= 3 ? 'step-accent' : ''
					} text-lg font-bold`}
				>
					<div className="pt-2">Select Map</div>
				</li>
			</ul>
			<div className="flex items-center justify-center flex-grow w-full">
				<div className="w-4/5">
					{currentStep === 1 && <Step1 setStep={setCurrentStep} />}
					{currentStep === 2 && <Step2 setStep={setCurrentStep} />}
					{currentStep === 3 && <Step3 />}
				</div>
			</div>
		</div>
	);
};

export default function Steps() {
	return (
		<>
			<StepsList />
		</>
	);
}
