'use client';

const Stats = () => {
	return (
		<div className="stats stats-vertical">
			<div className="stat">
				<div className="stat-title">Downloads</div>
				<div className="stat-value">31K</div>
				<div className="stat-desc">Jan 1st - Feb 1st</div>
			</div>

			<div className="stat">
				<div className="stat-title">New Users</div>
				<div className="stat-value">4,200</div>
				<div className="stat-desc">↗︎ 400 (22%)</div>
			</div>

			<div className="stat">
				<div className="stat-title">New Registers</div>
				<div className="stat-value">1,200</div>
				<div className="stat-desc">↘︎ 90 (14%)</div>
			</div>
		</div>
	);
};

const Avatar = () => {
	return (
		<div className="avatar">
			<div className="w-24 rounded-full">
				<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
			</div>
		</div>
	);
};

const Matchmaking = () => {
	return (
		<div className="h-full flex flex-col items-center justify-evenly">
			{/* Wrapper for the two boxes, taking up 80% width */}
			<div className="flex w-4/5 h-3/5 gap-x-8">
				{/* Each box flexibly fills half of the wrapper's width */}
				<div className="border border-white flex-1 flex justify-center items-start">
					{/* Stats */}
					<Stats />
					{/* Avatar */}
					<Avatar />
				</div>
				<div className="border border-white flex-1"></div>
			</div>
			{/* Buttons */}
			<div className="flex space-x-4">
				<div className="btn btn-accent">Find match</div>
				<div className="btn btn-accent">Cancel</div>
				<div className="btn btn-accent">Go Back</div>
			</div>
		</div>
	);
};

export default Matchmaking;
