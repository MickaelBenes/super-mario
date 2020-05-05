import {findPlayers} from '../player.js';

function getPlayer(level)
{
  for (let entity of findPlayers(level)) {
    return entity;
  }
}

export function createLevelLoadingLayer(font, level)
{
  const FONT_SIZE = font.size;
  const spriteBuffer	= document.createElement( 'canvas' );
  spriteBuffer.width	= 32;
  spriteBuffer.height	= 32;
  const spriteBufferContext = spriteBuffer.getContext( '2d' );

  return function drawWaitScreen(context)
  {
    const entity = getPlayer(level);
    spriteBufferContext.clearRect(0, 0, spriteBuffer.width, spriteBuffer.height);
    entity.draw(spriteBufferContext);
    context.drawImage(spriteBuffer, FONT_SIZE * 12, FONT_SIZE * 15);

    font.print(`WORLD ${level.name}`, context, FONT_SIZE * 12, FONT_SIZE * 12);
    font.print(`x ${entity.player.lives.toString().padStart(3, ' ')}`,
               context,
               FONT_SIZE * 16,
               FONT_SIZE * 16);
  }
}
