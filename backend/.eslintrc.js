// AIRBNB ESLINT CONFIGURATION

module.exports = {
	root: true,
	plugins: ['@typescript-eslint', 'import', 'prettier'],
	extends: [
		'airbnb-typescript/base',
		'prettier',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/typescript',
		'plugin:prettier/recommended', // from your current config
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.eslint.json', // assuming you're using a separate TSConfig for ESLint
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js'],
	rules: {
		// Merge or override rules as needed
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/lines-between-class-members': 'off',
		// Add other rules from the guide or adjust as per your project needs
		indent: ['error', 'tab', { SwitchCase: 1 }], // Set indent rule to use tabs
	},
};

// AIRBNB ESLINT CONFIGURATION

// module.exports = {
//   root: true,
//   plugins: ['@typescript-eslint', 'import', 'prettier'],
//   extends: [
//     'airbnb-typescript/base',
//     'prettier',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:import/typescript',
//     'plugin:prettier/recommended', // from your current config
//   ],
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     project: './tsconfig.eslint.json', // assuming you're using a separate TSConfig for ESLint
//     tsconfigRootDir: __dirname,
//     sourceType: 'module',
//   },
//   env: {
//     node: true,
//     jest: true,
//   },
//   ignorePatterns: ['.eslintrc.js'],
//   rules: {
//     // Merge or override rules as needed
//     '@typescript-eslint/interface-name-prefix': 'off',
//     '@typescript-eslint/explicit-function-return-type': 'off',
//     '@typescript-eslint/explicit-module-boundary-types': 'off',
//     '@typescript-eslint/no-explicit-any': 'off',
//     // Add other rules from the guide or adjust as per your project needs
//   },
// };
