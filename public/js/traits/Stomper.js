import { Trait } from '../Entity.js';

export default class Stomper extends Trait {

	constructor() {
		super( 'stomper' );

		this.bounceSpeed	= 400;
		this.queueBouunce	= false;
	}

	bounce() {
		this.queueBouunce = true;
	}

	update( entity ) {
		if ( this.queueBouunce ) {
			entity.vel.y		= -this.bounceSpeed;
			this.queueBouunce	= false;
		}
	}

}