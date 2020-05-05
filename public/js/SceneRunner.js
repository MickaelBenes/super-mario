import Scene from './Scene.js';

export default class SceneRunner
{
  constructor()
  {
    this.scenes = [];
    this.sceneIndex = -1;
  }

  addScene(scene)
  {
    scene.events.listen(Scene.EVENT_COMPLETE, () => this.runNext());
    this.scenes.push(scene);
  }

  runNext()
  {
    const currentScene = this.getCurrentScene();
    if (currentScene) {
      currentScene.pause();
    }
    this.sceneIndex++;
  }

  update(gameContext)
  {
    const currentScene = this.getCurrentScene();
    if (currentScene) {
      currentScene.update(gameContext);
      currentScene.draw(gameContext);
    }
  }

  getCurrentScene()
  {
    return this.scenes[this.sceneIndex];
  }
};
