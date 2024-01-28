import { Quicksand } from 'next/font/google';
import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {},
	plugins: [require('daisyui')],
	// daisyui: {
	//   themes: ["forest", "", ""],
	// },
	daisyui: {
		themes: [
			{
				mytheme: {
					primary: '#181c26',
					secondary: '#232630',
					accent: '#6941b0',
					info: '#2094f3',
					'base-100': '#181c26',
					'base-200': '#232630',
				},
			},
		],
	},
};
export default config;
