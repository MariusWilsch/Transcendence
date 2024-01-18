'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card1Picture from '../assets/images/card1.png';
import Card2Picture from '../assets/images/card2.png';
import Placeholder from '../assets/images/placeholder.png';
import PlaceholderBlack from '../assets/images/placeholderBlack.png';
import PlaceholderWhite from '../assets/images/placeholderWhite.png';
import Image from 'next/image';
import { startConnection } from '@/app/GlobalRedux/features';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectionState } from '@/interfaces';
import { RootState } from '../GlobalRedux/store';

//* Helper components
//! Add this to it's own file, maybe /components/*

const Input = ({ ariaLabel }: { ariaLabel: string }) => {
	return (
		<input
			//! I need to figure out what to do on have and when the input is checked
			className="join-item btn bg-transparent border-0 border-r border-slate-500/40 text-black"
			type="radio"
			name="options"
			aria-label={ariaLabel}
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

const CardOverlay = ({ title, desc, img, currentStep, handleClick }: any) => {
	return (
		<>
			<div
				className="card shadow-xl image-full boxTransform w-[60%] h-[80%]"
				onClick={handleClick}
			>
				<figure>
					<Image src={img} alt="Pre-configured game" />
				</figure>
				<div className="card-body items-center justify-center">
					<h2 className="card-title">{title}</h2>
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
				<div className="modal-action justify-center">
					<form method="dialog">
						<button className="btn">Cancel Matchmaking</button>
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
	return (
		<>
			<div className="flex w-full items-center gap-x-4">
				<CardOverlay
					title={'Play against AI'}
					desc={'Sum hipster ipsum here'}
					img={Card1Picture}
					currentStep={1}
					handleClick={() => setStep(2)}
				/>
				<div className="divider divider-horizontal">OR</div>
				<CardOverlay
					title={'Play against other players'}
					desc={'Sum hipster ipsum here'}
					img={Card2Picture}
					currentStep={0}
					handleClick={() => setStep(2)}
				/>
			</div>
		</>
	);
};

const Step2 = ({ setStep }: any) => {
	return (
		<>
			<div className="flex flex-col lg:flex-row gap-4">
				<CardOverlay
					title={'Play using your mouse'}
					desc={'Sum hipster ipsum here'}
					img={Placeholder}
					currentStep={0}
					handleClick={() => setStep(3)}
				/>
				<div className="divider lg:divider-horizontal">OR</div>
				<CardOverlay
					title={'Play using your keyboard'}
					desc={''}
					img={Placeholder}
					currentStep={2}
					handleClick={() => setStep(3)}
				/>
			</div>
		</>
	);
};

const Step3 = () => {
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
			<div className="diff aspect-[16/9] w-4/5 mx-auto rounded-xl">
				<div className="diff-item-1">
					<Image src={PlaceholderWhite} alt="Map Choice !" />
				</div>
				<div className="diff-item-2">
					<Image src={PlaceholderBlack} alt="Map Choice 2" />
				</div>
				<div className="diff-resizer"></div>
			</div>
			<button className="btn btn-accent mt-8" onClick={handleStartGame}>
				START A GAME
			</button>
			<Modal />
		</>
	);
};

const StepsList = () => {
	const [currentStep, setCurrentStep] = useState(1);

	return (
		<div className="flex pt-4 flex-col items-center gap-x-12 h-full justify-between">
			<ul className="steps steps-horizontal w-[60%]">
				<li className={`step ${currentStep >= 1 ? 'step-accent' : ''}`}>
					<div className="pt-2">Select Game Type</div>
				</li>
				<li className={`step ${currentStep >= 2 ? 'step-accent' : ''}`}>
					<div className="pt-2">Select Input Controls</div>
				</li>
				<li className={`step ${currentStep >= 3 ? 'step-accent' : ''}`}>
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
