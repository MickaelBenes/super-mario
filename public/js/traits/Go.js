import { Trait } from '../Entity.js';

export default class Go extends Trait {

	constructor() {
		super( 'go' );

		this.direction		= 0;
		this.acceleration	= 400;
		this.dragFactor		= 1 / 5000;
		this.distance		= 0;
		this.heading		= 1;
	}

	update( entity, deltaTime ) {
		if ( this.direction ) {
			entity.vel.x	+= this.acceleration * deltaTime * this.direction;
			this.heading	= this.direction;
			this.distance	+= Math.abs( entity.vel.x ) * deltaTime;
		}
		else {
			this.distance = 0;
		}

		const drag = this.dragFactor * entity.vel.x * Math.abs( entity.vel.x );
	}

}