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
import { get } from 'http';

//* The Redux store for the application.

//! Refactoring needed
//TODO: The reducers have some reduant states and actions that can be improved
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
	middleware: (getDefaultMiddleware: any) =>
		getDefaultMiddleware().concat(socketMiddleware),
});
