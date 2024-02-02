import useMouse from '@/public/static/images/useMouse.png';
import useKeyboard from '@/public/static/images/useKeyboard.png';
import { CardOverlay } from '@/app/gamelobby/components';
import { useDispatch } from 'react-redux';
import { setInputType, InputType } from '@/app/gamelobby/GlobalRedux/features';

export const Step2 = ({ setStep }: any) => {
	const dispatch = useDispatch();

	const handleClick = (inputType: InputType) => {
		dispatch(setInputType(inputType));
		setStep(3);
	};

	return (
		<>
			<div className="flex flex-col w-full lg:flex-row items-center gap-8 text-white">
				<CardOverlay
					title={'Play using your mouse'}
					desc={'Sum hipster ipsum here'}
					img={useMouse}
					currentStep={0}
					handleClick={() => handleClick(InputType.MOUSE)}
				/>
				<div className="lg:divider lg:divider-horizontal hidden">OR</div>
				<CardOverlay
					title={'Play using your keyboard'}
					desc={''}
					img={useKeyboard}
					currentStep={2}
					handleClick={() => handleClick(InputType.KEYBOARD)}
				/>
			</div>
		</>
	);
};
