import { configureStore } from '@reduxjs/toolkit';
import { gameReducer } from './features'; // import the reducers
import { socketMiddleware } from './middleware/WebSocket';

// /**
//  * The Redux store for the application.
//  */
export const store = configureStore({
	reducer: {
		game: gameReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(socketMiddleware),
});
