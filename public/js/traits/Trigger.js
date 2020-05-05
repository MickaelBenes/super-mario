import {Trait} from '../Entity.js';

export default class Trigger extends Trait
{
  constructor()
  {
    super('trigger');

    this.touches = new Set();
    this.conditions = [];
  }

  collides(_, them)
  {
    this.touches.add(them);
  }

  update(entity, gameContext, level)
  {
    if (this.touches.size > 0) {
      for (let condition of this.conditions) {
        condition(entity, this.touches, gameContext, level);
      }
      this.touches.clear();
    }
  }
}
