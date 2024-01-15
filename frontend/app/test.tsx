import Cards from './cards/Cards';
import Steps from './steps/Steps';

export const Sidebar = () => {
	return (
		<div className="w-[5vw] bg-base-200 flex flex-col items-center justify-center space-y-[50%] flex-shrink-0">
			<div className="w-8 h-8 bg-gray-300 absolute top-4"></div>{' '}
			{/* Logo placeholder */}
			<div className="w-6 h-6 bg-gray-300"></div>{' '}
			{/* Icon placeholder - I need to add percentage based width's as soon as I have the icon's */}
			<div className="w-6 h-6 bg-gray-300"></div> {/* Icon placeholder */}
			<div className="w-6 h-6 bg-gray-300"></div> {/* Icon placeholder */}
			<div className="w-6 h-6 bg-gray-300"></div> {/* Icon placeholder */}
			<div className="w-6 h-6 bg-gray-300"></div> {/* Icon placeholder */}
		</div>
	);
};

const NavBar = () => {
	return <div className="h-[8vh] bg-base-200 "></div>;
};

const Content = () => {
	return (
		<div className="flex flex-1 flex-col  justify-center -mt-1 -ml-1 rounded-tl-2xl bg-base-100 h-full">
			<Cards />
			{/* <Steps /> */}
			{/* <GamePage /> */}
		</div>
	);
};

const Test = () => {
	return (
		<div className="flex flex-col h-screen w-screen">
			<div className="flex flex-1">
				<Sidebar />
				<div className="flex flex-col">
					<NavBar />
					<Content />
				</div>
			</div>
		</div>
	);
};

export default Test;
