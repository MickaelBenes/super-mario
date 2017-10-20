import { Trait } from '../Entity.js';

export default class Go extends Trait {

	constructor() {
		super( 'go' );

		this.direction	= 0;
		this.speed		= 6000;
		this.distance	= 0;
		this.heading	= 1;
	}

	update( entity, deltaTime ) {
		entity.vel.x = this.speed * this.direction * deltaTime;

		if ( this.direction ) {
			this.heading	= this.direction;
			this.distance	+= Math.abs( entity.vel.x ) * deltaTime;
		}
		else {
			this.distance = 0;
		}
	}

}