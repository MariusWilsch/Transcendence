import { configureStore } from '@reduxjs/toolkit';
import {
	connectionReducer,
	gameReducer,
	ConnectionState,
	gameConfigReducer,
} from './features'; // import the reducers
import { socketMiddleware } from './middleware/WebSocket';
import { GameState } from '@/interfaces';
import { GameConfigState } from './features/reducers/gameConfig';

//* The Redux store for the application.

export interface RootState {
	game: GameState;
	connection: ConnectionState;
	gameConfig: GameConfigState;
	//* Add other state properties here if needed
}

export const store = configureStore({
	reducer: {
		game: gameReducer,
		connection: connectionReducer,
		gameConfig: gameConfigReducer,
		//* Add other reducers here if needed
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(socketMiddleware),
});
