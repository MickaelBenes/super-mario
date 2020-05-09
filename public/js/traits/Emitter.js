import Trait from '../Trait.js';

export default class Emitter extends Trait
{
  constructor()
  {
    super();
    this.interval = 2;
    this.coolDown = this.interval;
    this.emitters = [];
  }

  update(entity, gameContext, level)
  {
    this.coolDown -= gameContext.deltaTime;
    if (this.coolDown <= 0) {
      this.emit(entity, gameContext, level);
      this.coolDown = this.interval;
    }
  }

  emit(entity, gameContext, level)
  {
    for (const emitter of this.emitters) {
      emitter(entity, gameContext, level);
    }
  }
}
