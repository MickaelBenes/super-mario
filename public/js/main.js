import Camera from './Camera.js';
import Entity from './Entity.js';
import PlayerController from './traits/PlayerController.js';
import Timer from './Timer.js';
import { setupKeyboard } from './input.js';
import { createLevelLoader } from './loaders/level.js';
import { loadEntities } from './entities.js';

function createPlayerEnvironment( playerEntity ) {
	const playerEnv 	= new Entity();
	const playerControl	= new PlayerController();

	playerControl.checkpoint.set( 64, 64 );
	playerControl.setPlayer( playerEntity );
	playerEnv.addTrait( playerControl );

	return playerEnv;
}

async function main( canvas ) {
	const context = canvas.getContext( '2d' );

	const entityFactory = await loadEntities();
	const loadLevel		= await createLevelLoader( entityFactory );
	const level			= await loadLevel( '1-1' );

	const camera = new Camera();
	window.camera = camera;

	const mario = entityFactory.mario();

	const playerEnv = createPlayerEnvironment( mario );
	level.entities.add( playerEnv );

	const input = setupKeyboard( mario );
	input.listenTo( window );

	const timer = new Timer();

	timer.update = deltaTime => {
		level.update( deltaTime );

		camera.pos.x = Math.max( 0, mario.pos.x - 100 );

		level.comp.draw( context, camera );
	};

	timer.start();
}

const canvas = document.getElementById( 'screen' );
main( canvas );
