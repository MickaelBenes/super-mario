import KeyboardState from './KeyboardState.js';

const SPACE			= 'Space';
const ARROW_RIGHT	= 'ArrowRight';
const ARROW_LEFT	= 'ArrowLeft';

export function setupKeyboard( entity ) {
	const input = new KeyboardState();

	input.addMapping( SPACE, keyState => {
		if ( keyState ) {
			entity.jump.start();
		}
		else {
			entity.jump.cancel();
		}
	});

	input.addMapping( ARROW_RIGHT, keyState => {
		entity.go.direction += keyState ? 1 : -1;
	});

	input.addMapping( ARROW_LEFT, keyState => {
		entity.go.direction += keyState ? -1 : 1;
	});

	return input;
}