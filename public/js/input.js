import KeyboardState from './KeyboardState.js';
import InputRouter from './InputRouter.js';
import Jump from './traits/Jump.js';
import Go from './traits/Go.js';

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
      router.route(entity => entity.getTrait(Jump).start());
    } else {
      router.route(entity => entity.getTrait(Jump).cancel());
    }
  });

  input.addMapping(KEY_TURBO, keyState =>
  {
    router.route(entity => entity.turbo(keyState));
  });

  input.addMapping(KEY_MOVE_RIGHT, keyState =>
  {
    router.route(entity => entity.getTrait(Go).direction += keyState ? 1 : -1);
  });

  input.addMapping(KEY_MOVE_LEFT, keyState =>
  {
    router.route(entity => entity.getTrait(Go).direction += keyState ? -1 : 1);
  });

  return router;
}
