'use client';
import React, { useState } from 'react';
import { Step1, Step2, Step3 } from './index';

const StepsList: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(3);

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
