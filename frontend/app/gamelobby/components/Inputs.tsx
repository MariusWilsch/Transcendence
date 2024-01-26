import { useDispatch } from 'react-redux';
import {
	setAiDifficulty,
	aiDifficulty,
	setInputType,
} from '@/app/gamelobby/GlobalRedux/features';
// Button.tsx

type ButtonProps = {
	label: string;
	difficulty: aiDifficulty;
	setStep?: (step: number) => void;
};

const Button: React.FC<ButtonProps> = ({ label, difficulty, setStep }) => {
	const dispatch = useDispatch();

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		dispatch(setAiDifficulty(difficulty));
		setStep && setStep(2);
	};

	return (
		<button
			onClick={handleClick}
			className="btn join-item text-white bg-opacity-0 bg-white hover:bg-opacity-70 font-medium py-2 px-4 rounded-lg transition duration-150 ease-in-out"
		>
			{label}
		</button>
	);
};

// JoinedButtons component
type JoinedButtonsProps = {
	setStep?: (step: number) => void;
};

export const JoinedButtons: React.FC<JoinedButtonsProps> = ({ setStep }) => {
	return (
		<div className="join mt-4 border border-1 border-primary">
			<Button label="Easy" difficulty={aiDifficulty.EASY} setStep={setStep} />
			<Button
				label="Medium"
				difficulty={aiDifficulty.MEDIUM}
				setStep={setStep}
			/>
			<Button label="Hard" difficulty={aiDifficulty.HARD} setStep={setStep} />
		</div>
	);
};
