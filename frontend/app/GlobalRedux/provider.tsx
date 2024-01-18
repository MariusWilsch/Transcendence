'use client';
import { Provider } from 'react-redux';
import { store } from './store';

/**
 * The function "Providers" is a TypeScript React component that wraps its children with a Redux
 * Provider component, passing in a store prop.
 * @param  - The `Providers` function is a React component that takes in a single prop called
 * `children`. The `children` prop is of type `React.ReactNode`, which means it can accept any valid
 * React element or component as its value.
 * @returns The `Providers` component is returning the `children` wrapped in a `Provider` component
 * with the `store` prop.
 */
export function Providers({ children }: { children: React.ReactNode }) {
	return <Provider store={store}>{children}</Provider>;
}
