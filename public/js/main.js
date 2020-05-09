import Level from './Level.js';
import Scene from './Scene.js';
import SceneRunner from './SceneRunner.js';
import Timer from './Timer.js';
import TimedScene from './TimedScene.js';
import {loadEntities} from './entities.js';
import {loadFont} from './loaders/font.js';
import {setupKeyboard} from './input.js';
import {createLevelLoader} from './loaders/level.js';
import {createCollisionLayer} from './layers/collision.js';
import {createDashboardLayer} from './layers/dashboard.js';
import {makePlayer, createPlayerEnvironment, findPlayers} from './player.js';
import {createLevelLoadingLayer} from './layers/level-loading.js';
import {createColorLayer} from './layers/color.js';
import {createTextLayer} from './layers/text.js';

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

  const mario = entityFactory.mario();
  makePlayer(mario, 'MARIO');
  window.mario = mario;

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  async function runLevel(levelName)
  {
    const loadScreen = new Scene();
    loadScreen.comp.layers.push(createColorLayer('#000'));
    loadScreen.comp.layers.push(createTextLayer(font, `Loading ${levelName}...`));
    sceneRunner.addScene(loadScreen);
    sceneRunner.runNext();

    const level = await loadLevel(levelName);
    const dashboardLayer = createDashboardLayer(font, level);
    const levelLoadingLayer = createLevelLoadingLayer(font, level);
    const playerEnv = createPlayerEnvironment(mario);

    level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, triggerer) =>
    {
      if (spec.type === 'goto') {
        for (let _ of findPlayers(triggerer)) {
          runLevel(spec.name);
          return;
        }
      }
    });

    mario.pos.set(0, 0);

    level.entities.add(mario);
    level.entities.add(playerEnv);

    const waitScreen = new TimedScene();
    waitScreen.comp.layers.push(createColorLayer('#000'));
    waitScreen.comp.layers.push(dashboardLayer);
    waitScreen.comp.layers.push(levelLoadingLayer);

    sceneRunner.addScene(waitScreen);

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

  await runLevel('1-1');
  // await runLevel('debug-progression');
  // await runLevel('debug-coin');
}

const canvas = document.getElementById('screen');
const start = () =>
{
  window.removeEventListener('click', start);
  main(canvas);
};
window.addEventListener('click', start);
