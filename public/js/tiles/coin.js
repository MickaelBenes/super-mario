import Player from '../traits/Player.js';

function handle({entity, match, resolver})
{
  if (entity.getTrait(Player)) {
    entity.getTrait(Player).addCoins(1);
    const grid = resolver.matrix;
    grid.delete(match.indexX, match.indexY);
  }
}

export const coin = [handle, handle];
