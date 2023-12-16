import * as Phaser from 'phaser';

class MainScene extends Phaser.Scene {
	constructor() {
		// Constructor that calls the constructor of the base class.
		super('MainScene'); // Name of the scene
	}

	preload() {
		// Preload assets
		//! I'm not using any assets in this example, but you can load them here.
	}

	create() {
		// Create game entities
	}

	update() {
		// Update game entities
	}
}

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO, // Which renderer to use
	width: 800, // Canvas width in pixels
	height: 600, // Canvas height in pixels
	backgroundColor: '#FFFFFF', // Set background color (white)
	scale: {
		// mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH, // Center game in parent
	},
	physics: {
		default: 'arcade', // Arcade Physics which is lightweight
		arcade: {
			gravity: { y: 0 }, // Top down game, so no gravity
		},
	},
	scene: [MainScene],
};
//1. Set up your Phaser development environment in Next.js.
new Phaser.Game(config);

//2. Create a new Phaser scene.

export default function Game();
