import {Vec2} from './math.js';
import BoundingBox from './BoundingBox.js';
import AudioBoard from './AudioBoard.js';
import EventBuffer from './EventBuffer.js';
import Trait from './Trait.js';

export const Sides = {
  TOP: Symbol('top'),
  BOTTOM: Symbol('bottom'),
  LEFT: Symbol('left'),
  RIGHT: Symbol('right'),
};

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
    this.traits = new Map();
    this.events = new EventBuffer();
  }

  hasTrait(trait)
  {
    return this.traits.has(trait);
  }

  getTrait(trait)
  {
    return this.traits.get(trait);
  }

  addTrait(trait)
  {
    this.traits.set(trait.constructor, trait);
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
    this.events.emit(Trait.EVENT_TASK, this);

    this.traits.forEach(trait => {
      trait.finalize(this);
    });

    this.events.clear();
  }
}
