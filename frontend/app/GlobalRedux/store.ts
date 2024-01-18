import { configureStore } from '@reduxjs/toolkit';
import { connectionReducer, gameReducer, ConnectionState } from './features'; // import the reducers
import { socketMiddleware } from './middleware/WebSocket';
import { GameState } from '@/interfaces';

//* The Redux store for the application.

export interface RootState {
	game: GameState;
	connection: ConnectionState;
	//* Add other state properties here if needed
}

export const store = configureStore({
	reducer: {
		game: gameReducer,
		connection: connectionReducer,
		//* Add other reducers here if needed
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(socketMiddleware),
});
