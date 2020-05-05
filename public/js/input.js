import KeyboardState from './KeyboardState.js';
import InputRouter from './InputRouter.js';

const KEY_JUMP = 'Space';
const KEY_MOVE_RIGHT = 'KeyD';
const KEY_MOVE_LEFT = 'KeyA';
const KEY_TURBO = 'ArrowUp';

export function setupKeyboard(window)
{
  const input = new KeyboardState();
  const router = new InputRouter();

  input.listenTo(window);

  input.addMapping(KEY_JUMP, keyState =>
  {
    if (keyState) {
      router.route(entity => entity.jump.start());
    } else {
      router.route(entity => entity.jump.cancel());
    }
  });

  input.addMapping(KEY_TURBO, keyState =>
  {
    router.route(entity => entity.turbo(keyState));
  });

  input.addMapping(KEY_MOVE_RIGHT, keyState =>
  {
    router.route(entity => entity.go.direction += keyState ? 1 : -1);
  });

  input.addMapping(KEY_MOVE_LEFT, keyState =>
  {
    router.route(entity => entity.go.direction += keyState ? -1 : 1);
  });

  return router;
}
