import React, {useState} from 'react'
import { GameService } from './GameService'
import { GameState } from '../GlobalRedux/features'
import useSocket from '../useSocket'

interface PlayerMove {
	playerID: number;
	direction: 'up' | 'down';

}

const GameCanvas = () => {
	const	canvasRef = React.useRef<HTMLDivElement>(null)
	const	serviceRef = React.useRef<GameService | null>(null);
	const [sendToServer, setSendToServer] = useState<(data: any) => void>();

	const createMovePayload = (playerID: number, direction: 'up' | 'down') => {
		return {
			playerID,
			direction
		}
	}
	
	React.useEffect(() => {
		let payload: PlayerMove; //! Change later

		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'w':
					console.log('Player 1 move up');
					payload = createMovePayload(1, 'up');
					break
				case 's':
					break
				case 'ArrowUp':
					break
				case 'ArrowDown':
					break
			}
			if (payload && sendToServer) sendToServer(payload)
		}
		
		const handleKeyUp = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'w': payload = createMovePayload(1, 'down'); break;
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
	


	const initGame = (state: GameState) => {
		console.log('init game');
				console.log(serviceRef.current);
		if (serviceRef.current != null) return
    serviceRef.current = new GameService(canvasRef.current!, state.canvas.width, state.canvas.height);
    serviceRef.current.initGameElements(state.ball, state.paddles);
	}

	const updateGame = (state: GameState) => {
		// console.log('update game');
		if (serviceRef.current == null) return
		serviceRef.current.updateGameElements(state.ball, state.paddles)
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