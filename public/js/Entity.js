import { Vec2 } from './math.js';
import BoundingBox from './BoundingBox.js';

export const Sides = {
	TOP		: Symbol( 'top' ),
	BOTTOM	: Symbol( 'bottom' ),
	LEFT	: Symbol( 'left' ),
	RIGHT	: Symbol( 'right' ),
};

export class Trait {

	constructor( name ) {
		this.name = name;
	}

	obstruct() {}

	update() {}

	collides( us, them ) {}

}

export default class Entity {

	constructor() {
		this.pos		= new Vec2( 0, 0 );
		this.vel		= new Vec2( 0, 0 );
		this.size		= new Vec2( 0, 0 );
		this.offset		= new Vec2( 0, 0 );
		this.bounds		= new BoundingBox( this.pos, this.size, this.offset );
		this.lifetime	= 0;
		this.traits		= [];
	}

	addTrait( trait ) {
		this.traits.push( trait );
		this[ trait.name ] = trait;
	}

	obstruct( side ) {
		this.traits.forEach(trait => {
			trait.obstruct( this, side );
		});
	}

	draw() {}

	update( deltaTime, level ) {
		this.traits.forEach(trait => {
			trait.update( this, deltaTime, level );
		});

		this.lifetime += deltaTime;
	}

	collides( candidate ) {
		this.traits.forEach(trait => {
			trait.collides( this, candidate );
		});
	}

}