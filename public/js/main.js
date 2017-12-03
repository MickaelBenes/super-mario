import Camera from './Camera.js';
import Entity from './Entity.js';
import PlayerController from './traits/PlayerController.js';
import Timer from './Timer.js';
import { loadEntities } from './entities.js';
import { loadFont } from './loaders/font.js';
import { setupKeyboard } from './input.js';
import { createLevelLoader } from './loaders/level.js';
import { createCollisionLayer } from './layers/collision.js';
import { createDashboardLayer } from './layers/dashboard.js';

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

	const [ entityFactory, font ] = await Promise.all( [loadEntities(), loadFont()] );
	const loadLevel		= await createLevelLoader( entityFactory );
	const level			= await loadLevel( '1-1' );

	const camera = new Camera();
	window.camera = camera;

	const mario = entityFactory.mario();

	const playerEnv = createPlayerEnvironment( mario );
	level.entities.add( playerEnv );

	level.comp.layers.push( createCollisionLayer(level) );
	level.comp.layers.push( createDashboardLayer(font, playerEnv) );

	const input = setupKeyboard( mario );
	input.listenTo( window );

	const timer = new Timer();

	timer.update = deltaTime => {
		level.update( deltaTime );

		camera.pos.x = Math.max( 0, mario.pos.x - 100 );
		// TODO potential fix on the blur effect when the camera moves
		// camera.pos.x = Math.round( camera.pos.x * 1000 ) / 1000;﻿

		level.comp.draw( context, camera );
	};

	timer.start();
}

const canvas = document.getElementById( 'screen' );
main( canvas );
