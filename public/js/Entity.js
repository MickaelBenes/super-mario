import { Vec2 } from "./math.js";

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

	obstruct() {

	}

	update() {
		console.warn( 'Unandled update call in Trait.' );
	}

}

export default class Entity {

	constructor() {
		this.pos		= new Vec2( 0, 0 );
		this.vel		= new Vec2( 0, 0 );
		this.size		= new Vec2( 0, 0 );
		this.traits		= [];
		this.lifetime	= 0;
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

	update( deltaTime ) {
		this.traits.forEach(trait => {
			trait.update( this, deltaTime );
		});

		this.lifetime += deltaTime;
	}

}