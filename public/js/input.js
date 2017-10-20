import KeyboardState from './KeyboardState.js';

const KEY_JUMP			= 'Space';
const KEY_MOVE_RIGHT	= 'KeyD';
const KEY_MOVE_LEFT		= 'KeyA';
const KEY_TURBO			= 'ArrowUp';

export function setupKeyboard( mario ) {
	const input = new KeyboardState();

	input.addMapping( KEY_JUMP, keyState => {
		if ( keyState ) {
			mario.jump.start();
		}
		else {
			mario.jump.cancel();
		}
	});

	input.addMapping( KEY_TURBO, keyState => {
		mario.turbo( keyState );
	});

	input.addMapping( KEY_MOVE_RIGHT, keyState => {
		mario.go.direction += keyState ? 1 : -1;
	});

	input.addMapping( KEY_MOVE_LEFT, keyState => {
		mario.go.direction += keyState ? -1 : 1;
	});

	return input;
}