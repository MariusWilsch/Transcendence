import Image, { StaticImageData } from 'next/image';
import { JoinedButtons, Instructions } from '@/app/gamelobby/components';

type CardOverlayProps = {
	title: string;
	desc: string;
	img: StaticImageData;
	currentStep: number;
	handleClick: () => void;
	setStep?: (step: number) => void;
};

export const CardOverlay = ({
	title,
	desc,
	img,
	currentStep,
	handleClick,
	setStep,
}: CardOverlayProps) => {
	return (
		<>
			<div
				className="card shadow-xl image-full boxTransform w-[60%] h-[80%]"
				onClick={handleClick}
			>
				<figure>
					<Image
						src={img}
						alt="Pre-configured game"
						unoptimized={true}
						onError={(e: any) => {
							e.target.onerror = null;
							e.target.src =
								'http://m.gettywallpapers.com/wp-content/uploads/2023/05/Cool-Anime-Profile-Picture.jpg';
						}}
					/>
				</figure>
				<div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl"></div>
				<div className="card-body items-center justify-center">
					<h2 className="card-title ">{title}</h2>
					<div>{desc}</div>
					<div className="card-actions">
						{currentStep === 1 && <JoinedButtons setStep={setStep} />}
						{currentStep === 2 && <Instructions />}
					</div>
				</div>
			</div>
		</>
	);
};
