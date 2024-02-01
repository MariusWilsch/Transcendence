'use client';

import Link from 'next/link';
import { MdOutlineSearchOff } from 'react-icons/md';

export default function NotFound() {
	return (
		<div className="flex justify-center items-center w-full custom-height ">
			<div className="flex flex-col justify-center items-center w-full custom-height ">
				<MdOutlineSearchOff size="100" className="text-red-500 mb-6" />

				<div className="text-centre text-gray-200"> 404 Not found</div>
				<Link
					className="text-4xl font-bold text-center text-white z-10 font-sans"
					href="/"
				>
					Return Home
				</Link>
			</div>
		</div>
	);
}
