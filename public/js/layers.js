export function createBackgroundLayer( level, sprites ) {
	const buffer	= document.createElement( 'canvas' );
	buffer.width	= 2048;
	buffer.height	= 240;
	const context	= buffer.getContext( '2d' );

	level.tiles.forEach((tile, x, y) => {
		sprites.drawTile( tile.name, context, x, y );
	});

	return function drawBackgroundLayer( context, camera ) {
		context.drawImage( buffer, -camera.pos.x, -camera.pos.y );
	}
}

export function createSpriteLayer( entities, width = 64, height	= 64 ) {
	const spriteBuffer	= document.createElement( 'canvas' );
	spriteBuffer.width	= width;
	spriteBuffer.height	= height;

	const spriteBufferCtx = spriteBuffer.getContext( '2d' );

	return function drawSpriteLayer( context, camera ) {
		entities.forEach(entity => {
			spriteBufferCtx.clearRect( 0, 0, width, height );

			entity.draw( spriteBufferCtx );

			context.drawImage(
				spriteBuffer,
				entity.pos.x - camera.pos.x,
				entity.pos.y - camera.pos.y
			);
		})
	}
}

export function createCollisionLayer( level ) {
	const resolvedTiles = [];

	const tileResolver	= level.tileCollider.tiles;
	const tileSize		= tileResolver.tileSize;

	const getByIndexOriginal	= tileResolver.getByIndex;
	tileResolver.getByIndex		= function getByIndexFake( x, y ) {
		resolvedTiles.push( {x, y} );
		return getByIndexOriginal.call(tileResolver, x, y );
	}

	return function drawCollision( context, camera ) {
		context.strokeStyle = 'blue';
		resolvedTiles.forEach(( {x, y} ) => {
			context.beginPath();
			context.rect(
				x * tileSize - camera.pos.x,
				y * tileSize - camera.pos.y,
				tileSize,
				tileSize
			);
			context.stroke();
		});

		context.strokeStyle = 'red';
		level.entities.forEach(entity => {
			context.beginPath();
			context.rect(
				entity.pos.x - camera.pos.x,
				entity.pos.y - camera.pos.y,
				entity.size.x,
				entity.size.y
			);
			context.stroke();
		});

		resolvedTiles.length = 0;
	}
}
