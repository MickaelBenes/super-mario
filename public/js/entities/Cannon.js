import Entity from '../Entity.js';
import {loadAudioBoard} from '../loaders/audio.js';
import Emitter from '../traits/Emitter.js';
import {findPlayers} from '../player.js';

const HOLD_FIRE_THRESHHOLD = 30;

export function loadCannon(audioContext)
{
  return loadAudioBoard('cannon', audioContext)
      .then(audio => createCannonFactory(audio));
}

function createCannonFactory(audio)
{
  function emitBullet(cannon, gameContext, level)
  {
    let direction = 1;
    for (const player of findPlayers(level)) {
      if (player.pos.x > cannon.pos.x - HOLD_FIRE_THRESHHOLD
          && player.pos.x < cannon.pos.x + HOLD_FIRE_THRESHHOLD) {
        return;
      }

      if (player.pos.x < cannon.pos.x) {
        direction = -1;
      }
    }

    const bullet = gameContext.entityFactory.bullet();
    bullet.pos.copy(cannon.pos);
    bullet.vel.set(80 * direction, 0);

    cannon.sounds.add('shoot');
    level.entities.add(bullet);
  }

  return function createCannon() {
    const cannon = new Entity();
    cannon.audio = audio;

    const emitter = new Emitter();
    emitter.interval = 4;
    emitter.emitters.push(emitBullet);
    cannon.addTrait(emitter);

    return cannon;
  }
}