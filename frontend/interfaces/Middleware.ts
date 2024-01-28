import { UnknownAction, Dispatch, MiddlewareAPI } from 'redux';

// Types
export type MiddlewareStore = MiddlewareAPI<Dispatch<UnknownAction>>;
export type MiddlewareNext = Dispatch<UnknownAction>;

// Middleware interface
export interface Middleware {
	(store: MiddlewareStore): (
		next: MiddlewareNext,
	) => (action: UnknownAction) => any;
}
