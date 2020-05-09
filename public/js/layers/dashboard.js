import {findPlayers} from '../player.js';
import Player from '../traits/Player.js';
import LevelTimer from '../traits/LevelTimer.js';

function getPlayerTrait(entities)
{
  for (let entity of findPlayers(entities)) {
    return entity.getTrait(Player);
  }
}

function getTimerTrait(entities)
{
  for (let entity of entities) {
    if (entity.hasTrait(LevelTimer)) {
      return entity.getTrait(LevelTimer);
    }
  }
}

export function createDashboardLayer(font, level)
{
  const line1 = font.size;
  const line2 = line1 * 2;
  const timerTrait = getTimerTrait(level.entities);

  return function drawDashboard(context)
  {
    const playerTrait = getPlayerTrait(level.entities);

    font.print(playerTrait.name, context, 16, line1);
    font.print(playerTrait.score.toString().padStart(6, '0'), context, 16, line2);

    font.print('@x' + playerTrait.coins.toString().padStart(2, '0'), context, 96, line2);

    font.print('WORLD', context, 152, line1);
    font.print(level.name, context, 160, line2);

    font.print('TIME', context, 208, line1);
    font.print(timerTrait.currentTime.toFixed().toString().padStart(3, '0'), context, 216, line2);
  };
}
