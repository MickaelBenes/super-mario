import TileCollider from './TileCollider.js';
import EntityCollider from './EntityCollider.js';
import MusicController from './MusicController.js';
import Camera from './Camera.js';
import {findPlayers} from './player.js';
import Scene from './Scene.js';

function focusPlayer(level)
{
  for (let player of findPlayers(level)) {
    level.camera.pos.x = Math.max(0, player.pos.x - 100);
  }
}

export default class Level extends Scene
{
  static EVENT_TRIGGER = Symbol('trigger');

  constructor()
  {
    super();

    this.name = '';
    this.gravity = 1500;
    this.totalTime = 0;
    this.entities = new Set();
    this.tileCollider = new TileCollider();
    this.entityCollider = new EntityCollider(this.entities);
    this.musicController = new MusicController();
    this.camera = new Camera();
  }

  update(gameContext)
  {
    this.entities.forEach(entity => entity.update(gameContext, this));
    this.entities.forEach(entity => this.entityCollider.check(entity));
    this.entities.forEach(entity => entity.finalize());

    focusPlayer(this);

    this.totalTime += gameContext.deltaTime;
  }

  draw(gameContext)
  {
    this.comp.draw(gameContext.videoContext, this.camera);
  }

  pause()
  {
    this.musicController.pause();
  }
}
