'use Client'
import { useEffect } from 'react';
import { Socket, io } from 'socket.io-client';


//* Refactor idea:
//! I think using Redux Toolkit with Redux Middleware and Socket Service could be elegant here.

const useSocket = (initGame: Function, updateGame: Function, clearGame: Function, sendToServer: Function) => {

	useEffect(() => {
		const socket = io('http://localhost:3001');
		
		//* Socket event listeners

		socket.on('connect', () => {
				console.log('Connected to server');
		});

// socket.on('disconnect', function(this: any){	
    
// 	var self = this;
//     var rooms = Object.keys(self.rooms);
// 		console.log(rooms);
// });
			
		socket.on('disconnect', () => {
			console.log('Disconnected from server');
			clearGame();
		});
			
		socket.on('createGame', (gameState) => {
			console.log('Creating game');
			console.log(gameState);
			
			initGame(gameState);
		})
			
		socket.on('gameState', (gameState) => {
			console.log('Updating game');
			updateGame(gameState);
		});

		//* Socket event emitters

		// ! could be refactored to use a single function that takes in the event name and data
		sendToServer((data: any) => socket.emit('onPaddleMove', data));
	
		return () => {
			socket.disconnect();
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps
}

export default useSocket
