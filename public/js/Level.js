import Compositor from './Compositor.js';
import TileCollider from './TileCollider.js';
import EntityCollider from './EntityCollider.js';
import MusicController from './MusicController.js';

export default class Level
{
  constructor()
  {
    this.gravity = 1500;
    this.totalTime = 0;
    this.comp = new Compositor();
    this.entities = new Set();
    this.tileCollider = new TileCollider();
    this.entityCollider = new EntityCollider(this.entities);
    this.musicController = new MusicController();
  }

  update(gameContext)
  {
    this.entities.forEach(entity => {
      entity.update(gameContext, this);
    });

    this.entities.forEach(entity => {
      this.entityCollider.check(entity);
    });

    this.entities.forEach(entity => {
      entity.finalize();
    });

    this.totalTime += gameContext.deltaTime;
  }
}