export function createSpriteLayer(entities, width = 64, height = 64)
{
  const spriteBuffer = document.createElement('canvas');
  spriteBuffer.width = width;
  spriteBuffer.height = height;

  const spriteBufferCtx = spriteBuffer.getContext('2d');

  return function drawSpriteLayer(context, camera)
  {
    entities.forEach(entity =>
                     {
                       spriteBufferCtx.clearRect(0, 0, width, height);
                       entity.draw(spriteBufferCtx);
                       context.drawImage(spriteBuffer,
                                         Math.floor(entity.pos.x - camera.pos.x),
                                         Math.floor(entity.pos.y - camera.pos.y));
                     });
  };
}
