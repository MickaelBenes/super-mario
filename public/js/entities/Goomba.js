import Entity from '../Entity.js';
import Trait from '../Trait.js';
import Killable from '../traits/Killable.js';
import PendulumMove from '../traits/PendulumMove.js';
import Solid from '../traits/Solid.js';
import Physics from '../traits/Physics.js';
import {loadSpriteSheet} from '../loaders/sprite.js';
import Stomper from '../traits/Stomper.js';

export function loadGoomba()
{
  return loadSpriteSheet('goomba')
      .then(createGoombaFactory);
}

class Behavior extends Trait
{

  constructor()
  {
    super('behavior');
  }

  collides(us, them)
  {
    if (us.getTrait(Killable).dead) {
      return;
    }

    if (them.getTrait(Stomper)) {
      if (them.vel.y > us.vel.y) {
        us.getTrait(Killable).kill();
        us.getTrait(PendulumMove).speed = 0;
      } else {
        them.getTrait(Killable).kill();
      }
    }
  }

}

function createGoombaFactory(sprite)
{
  const walkAnim = sprite.animations.get('walk');

  function routeAnim(goomba)
  {
    if (goomba.getTrait(Killable).dead) {
      return 'flat';
    }

    return walkAnim(goomba.lifetime);
  }

  function drawGoomba(context)
  {
    sprite.draw(routeAnim(this), context, 0, 0);
  }

  return function createGoomba()
  {
    const goomba = new Entity();
    goomba.size.set(16, 16);

    goomba.addTrait(new Solid());
    goomba.addTrait(new Physics());
    goomba.addTrait(new PendulumMove());
    goomba.addTrait(new Behavior());
    goomba.addTrait(new Killable());

    goomba.draw = drawGoomba;

    return goomba;
  };
}
