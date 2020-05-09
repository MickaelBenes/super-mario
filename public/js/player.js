import Entity from './Entity.js';
import PlayerController from './traits/PlayerController.js';
import Player from './traits/Player.js';

export function createPlayerEnvironment(playerEntity)
{
  const playerEnv = new Entity();
  const playerControl = new PlayerController();

  playerControl.checkpoint.set(64, 64);
  playerControl.setPlayer(playerEntity);
  playerEnv.addTrait(playerControl);

  return playerEnv;
}

export function makePlayer(entity, name)
{
  const player = new Player();
  player.name = name;
  entity.addTrait(player);
}

export function* findPlayers(entities)
{
  for (const entity of entities) {
    if (entity.hasTrait(Player)) {
      yield entity;
    }
  }
}
