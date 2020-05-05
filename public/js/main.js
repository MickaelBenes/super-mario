import SceneRunner from './SceneRunner.js';
import Timer from './Timer.js';
import CompositionScene from './CompositionScene.js';
import {loadEntities} from './entities.js';
import {loadFont} from './loaders/font.js';
import {setupKeyboard} from './input.js';
import {createLevelLoader} from './loaders/level.js';
import {createCollisionLayer} from './layers/collision.js';
import {createDashboardLayer} from './layers/dashboard.js';
import {createPlayer, createPlayerEnvironment} from './player.js';
import {createLevelLoadingLayer} from './layers/level-loading.js';
import {createColorLayer} from './layers/color.js';
import Level from './Level.js';

async function main(canvas)
{
  const videoContext = canvas.getContext('2d');
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([
                                                    loadEntities(audioContext),
                                                    loadFont()
                                                  ]);

  const loadLevel = await createLevelLoader(entityFactory);
  const sceneRunner = new SceneRunner();

  const mario = createPlayer(entityFactory.mario());
  mario.player.name = 'MARIO';

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  async function runLevel(levelName)
  {
    const level = await loadLevel(levelName);
    const dashboardLayer = createDashboardLayer(font, level);
    const levelLoadingLayer = createLevelLoadingLayer(font, level);
    const playerEnv = createPlayerEnvironment(mario);

    level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, triggerer) =>
    {
      if (spec.type === 'goto') {
        for (let entity of triggerer) {
          if (entity.player) {
            runLevel(spec.name);
            return;
          }
        }
      }
    });

    mario.pos.set(0, 0);

    level.entities.add(mario);
    level.entities.add(playerEnv);

    const levelLoaderScreen = new CompositionScene();
    levelLoaderScreen.comp.layers.push(createColorLayer('#000'));
    levelLoaderScreen.comp.layers.push(dashboardLayer);
    levelLoaderScreen.comp.layers.push(levelLoadingLayer);
    sceneRunner.addScene(levelLoaderScreen);

    level.comp.layers.push(createCollisionLayer(level));
    level.comp.layers.push(dashboardLayer);
    sceneRunner.addScene(level);

    sceneRunner.runNext();
  }

  const gameContext = {
    audioContext,
    videoContext,
    entityFactory,
    deltaTime: null
  };

  const timer = new Timer();
  timer.update = deltaTime =>
  {
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
  };

  timer.start();

  await runLevel('debug-progression');
}

const canvas = document.getElementById('screen');
const start = () =>
{
  window.removeEventListener('click', start);
  main(canvas);
};
window.addEventListener('click', start);
