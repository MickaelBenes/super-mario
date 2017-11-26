import { Trait, Sides } from '../Entity.js';

const SPEED_BOOST = 0.3;

export default class Solid extends Trait {

	constructor() {
		super( 'solid' );

		this.obstructs = true;
	}

	obstruct( entity, side, match ) {
		if ( !this.obstructs ) {
			return;
		}

		if ( side === Sides.TOP ) {
			entity.bounds.top	= match.y2;
			entity.vel.y		= 0;
		}
		else if ( side === Sides.RIGHT ) {
			entity.bounds.right	= match.x1;
			entity.vel.x		= 0;
		}
		else if ( side === Sides.BOTTOM ) {
			entity.bounds.bottom	= match.y1;
			entity.vel.y			= 0;
		}
		else {
			entity.bounds.left	= match.x2;
			entity.vel.x		= 0;
		}
	}

}