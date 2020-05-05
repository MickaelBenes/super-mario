import {findPlayers} from '../player.js';

function getPlayerTrait(level)
{
  for (let entity of findPlayers(level)) {
    return entity.player;
  }
}

function getTimerTrait(level)
{
  for (let entity of level.entities) {
    if (entity.levelTimer) {
      return entity.levelTimer;
    }
  }
}

export function createDashboardLayer(font, level)
{
  const line1 = font.size;
  const line2 = line1 * 2;
  const timerTrait = getTimerTrait(level);

  return function drawDashboard(context)
  {
    const playerTrait = getPlayerTrait(level);

    font.print(playerTrait.name, context, 16, line1);
    font.print(playerTrait.score.toString().padStart(6, '0'), context, 16, line2);

    font.print('@x' + playerTrait.coins.toString().padStart(2, '0'), context, 96, line2);

    font.print('WORLD', context, 152, line1);
    font.print(level.name, context, 160, line2);

    font.print('TIME', context, 208, line1);
    font.print(timerTrait.currentTime.toFixed().toString().padStart(3, '0'), context, 216, line2);
  };
}
