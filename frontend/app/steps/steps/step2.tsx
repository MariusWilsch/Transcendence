import useMouse from '@/public/static/images/useMouse.png';
import useKeyboard from '@/public/static/images/useKeyboard.png';
import { CardOverlay } from '@/app/components';
import { useDispatch } from 'react-redux';
import {
	setMouseOrKeyboard,
	mouseOrKeyboard,
} from '@/app/GlobalRedux/features';

export const Step2 = ({ setStep }: any) => {
	const dispatch = useDispatch();

	const handleClick = (inputType: mouseOrKeyboard) => {
		dispatch(setMouseOrKeyboard(inputType));
		setStep(3);
	};

	return (
		<>
			<div className="flex flex-col w-full lg:flex-row items-center gap-8">
				<CardOverlay
					title={'Play using your mouse'}
					desc={'Sum hipster ipsum here'}
					img={useMouse}
					currentStep={0}
					handleClick={() => handleClick(mouseOrKeyboard.MOUSE)}
				/>
				<div className="lg:divider lg:divider-horizontal hidden">OR</div>
				<CardOverlay
					title={'Play using your keyboard'}
					desc={''}
					img={useKeyboard}
					currentStep={2}
					handleClick={() => handleClick(mouseOrKeyboard.KEYBOARD)}
				/>
			</div>
		</>
	);
};
