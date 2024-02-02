import playAgainstAI2 from '@/public/static/images/playAgainstAI2.png';
import playAgainstHuman from '@/public/static/images/playAgainstHuman.png';
import { CardOverlay } from '@/app/gamelobby/components';
import { RootState } from '@/app/gamelobby/GlobalRedux/store';
import { aiDifficulty } from '@/app/gamelobby/GlobalRedux/features';
import { useSelector } from 'react-redux';

export const Step1 = ({ setStep }: any) => {
	const difficulty = useSelector(
		(state: RootState) => state.gameConfig.aiDifficulty,
	);

	const handleAIClick = () => {
		if (difficulty === aiDifficulty.NONE) {
			alert('Please select a difficulty');
		}
	};

	return (
		<>
			<div className="flex flex-col w-full lg:flex-row items-center gap-8 text-white">
				<CardOverlay
					title={'Play against AI'}
					desc={'Sum hipster ipsum here'}
					img={playAgainstAI2}
					currentStep={1}
					handleClick={handleAIClick}
					setStep={setStep}
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
