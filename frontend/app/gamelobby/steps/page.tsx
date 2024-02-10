'use client';
import React, { useState, useEffect } from 'react';
import { Step1, Step2, Step3 } from './index';
import { useDispatch } from 'react-redux';
import { resetConfig } from '../GlobalRedux/features';

const StepItem: React.FC<{ stepNumber: number; currentStep: number }> = ({
	stepNumber,
	currentStep,
}) => {
	return (
		<li
			className={`step ${
				currentStep >= stepNumber ? 'step-accent' : ''
			} text-sm lg:text-lg font-bold`}
		>
			<div className="pt-2">
				{stepNumber === 1 && 'Select Game Type'}
				{stepNumber === 2 && 'Select Input Controls'}
				{stepNumber === 3 && 'Select Map'}
			</div>
		</li>
	);
};

const StepsList: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(1);
	const dispatch = useDispatch();

	useEffect(() => {
		const handleBackButton = () => dispatch(resetConfig());

		window.addEventListener('popstate', handleBackButton);
		return () => window.removeEventListener('popstate', handleBackButton);
	});

	return (
		<div className="z-50 flex pt-4 flex-col items-center gap-x-12 h-full justify-between">
			<ul className="steps steps-horizontal w-[60%] pt-4">
				<StepItem stepNumber={1} currentStep={currentStep} />
				<StepItem stepNumber={2} currentStep={currentStep} />
				<StepItem stepNumber={3} currentStep={currentStep} />
			</ul>
			<div className="flex items-center justify-center flex-grow w-full">
				<div className="w-4/5 flex flex-col items-center">
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
