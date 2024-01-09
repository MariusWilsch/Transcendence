'use client'
import React, { useState } from 'react'
import { GameService } from './GameService'
import { GameState } from '../GlobalRedux/features'
import useSocket from '../useSocket'

interface PlayerMove {
	direction: 'up' | 'down' | 'stop'
	player?: 'player1' | 'player2'
}

const GameCanvas = () => {
	const	canvasRef = React.useRef<HTMLDivElement>(null)
	const	serviceRef = React.useRef<GameService | null>(null);
	const [sendToServer, setSendToServer] = useState<(data: any) => void>();
	
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			let payload: PlayerMove | undefined = undefined;
			switch (e.key) {
				case 'w':
					payload = { direction: 'up', player: "player1" }
					break
				case 'ArrowUp':
					payload = {direction: 'up', player: "player2"}
					break
				case 's':
					payload = { direction: 'down', player: "player1" }
					break;
				case 'ArrowDown':
					payload = {direction: 'down', player: "player2"}
					break
			}
			if (payload && sendToServer) sendToServer(payload)
		}
		
		const handleKeyUp = (e: KeyboardEvent) => {
			let payload: PlayerMove | undefined = undefined;
			switch (e.key) {
				case 'w':
				case 's':
					payload = {direction: 'stop', player: "player1"}
					break
				case 'ArrowUp':
				case 'ArrowDown':
					payload = {direction: 'stop', player: "player2"}
					break
			}
			if (payload && sendToServer) sendToServer(payload)
		}
		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)
	
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}
	}, [sendToServer])
	


	const initGame = (state: GameState, canvasWidth: number, canvasHeight: number) => {
		console.log('init game');
		if (serviceRef.current != null) return
    serviceRef.current = new GameService(canvasRef.current!, canvasWidth, canvasHeight);
    serviceRef.current.initGameElements(state.ball, state.paddles);
	}

	const updateGame = (state: GameState) => {
		// console.log('update game');
		if (serviceRef.current == null) return
		serviceRef.current.updateGameElements(state)
	}

	const clearGame = () => {
		console.log('clear game');
		if (serviceRef.current == null) return
		serviceRef.current.clearGameElements()
		serviceRef.current = null
	}

	/**
	 * Initializes the game socket and sets up the sendMove function.
	 * 
	 * @param initGame - The function to initialize the game.
	 * @param updateGame - The function to update the game state.
	 * @param clearGame - The function to clear the game state.
	 * @param sendMove - The function to share data with my custom hook (useSocket).
	 * @description sendMove could be reused for other client to server communication.
	 */
	useSocket(initGame, updateGame, clearGame, (sendMove: (data: any) => void) => {
		setSendToServer(() => sendMove);
	}); // Cast the useSocket return value to Socket type

	return <div ref={canvasRef}/>
}

export default GameCanvas