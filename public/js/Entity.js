import {Vec2} from './math.js';
import BoundingBox from './BoundingBox.js';
import AudioBoard from './AudioBoard.js';
import EventBuffer from './EventBuffer.js';

export const Sides = {
  TOP: Symbol('top'),
  BOTTOM: Symbol('bottom'),
  LEFT: Symbol('left'),
  RIGHT: Symbol('right'),
};

export class Trait
{
  static EVENT_TASK = Symbol('task');

  constructor(name)
  {
    this.name = name;
    this.listeners = [];
  }

  collides(us, them) {}

  finalize(entity)
  {
    this.listeners = this.listeners.filter(listener => {
      entity.events.process(listener.name, listener.callback);
      return --listener.count;
    });
  }

  obstruct() {}

  update() {}

  queue(task)
  {
    this.listen(Trait.EVENT_TASK, task, 1);
  }

  listen(name, callback, count = Infinity)
  {
    this.listeners.push({name, callback, count});
  }
}

export default class Entity
{
  constructor()
  {
    this.audio = new AudioBoard();
    this.sounds = new Set();
    this.pos = new Vec2(0, 0);
    this.vel = new Vec2(0, 0);
    this.size = new Vec2(0, 0);
    this.offset = new Vec2(0, 0);
    this.bounds = new BoundingBox(this.pos, this.size, this.offset);
    this.lifetime = 0;
    this.traits = [];
    this.events = new EventBuffer();
  }

  addTrait(trait)
  {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  obstruct(side, match)
  {
    this.traits.forEach(trait => {
      trait.obstruct(this, side, match);
    });
  }

  draw() {}

  update(gameContext, level)
  {
    this.traits.forEach(trait => {
      trait.update(this, gameContext, level);
    });

    this.playSounds(this.audio, gameContext.audioContext);

    this.lifetime += gameContext.deltaTime;
  }

  collides(candidate)
  {
    this.traits.forEach(trait => {
      trait.collides(this, candidate);
    });
  }

  playSounds(audioBoard, audioContext)
  {
    this.sounds.forEach(sound => {
      audioBoard.playAudio(sound, audioContext);
    });

    this.sounds.clear();
  }

  finalize()
  {
    this.events.emit(Trait.EVENT_TASK);

    this.traits.forEach(trait => {
      trait.finalize(this);
    });

    this.events.clear();
  }
}
