import Entity, { Trait } from '../Entity.js';
import Killable from '../traits/Killable.js';
import PendulumWalk from '../traits/PendulumWalk.js';
import { loadSpriteSheet } from '../loaders.js';

export function loadKoopa() {
	return loadSpriteSheet( 'koopa' )
		.then( createKoopaFactory );
}

const STATE_WALKING	= Symbol( 'walking' );
const STATE_HIDING	= Symbol( 'hiding' );

class Behavior extends Trait {

	constructor() {
		super( 'behavior' );

		this.state			= STATE_WALKING;
		this.hideTime		= 0;
		this.hideDuration	= 5;
	}

	collides( us, them ) {
		if ( us.killable.dead ) {
			return;
		}

		if ( them.stomper ) {
			if ( them.vel.y > us.vel.y ) {
				this.handleStomp( us, them );
			}
			else {
				them.killable.kill();
			}
		}
	}

	handleStomp( us, them ) {
		if ( this.state === STATE_WALKING ) {
			this.hide( us );
		}
		else if ( this.state === STATE_HIDING ) {
			us.killable.kill();
			us.vel.set( 100, -200 );
		}
	}

	hide( us ) {
		us.vel.x				= 0;
		us.pendulumWalk.enabled	= false;
		this.hideTime			= 0;
		this.state				= STATE_HIDING;
	}

	unhide( us ) {
		us.pendulumWalk.enabled	= true;
		this.state				= STATE_WALKING;
	}

	update( us, deltaTime, level ) {
		if ( this.state === STATE_HIDING ) {
			this.hideTime += deltaTime;

			if ( this.hideTime > this.hideDuration ) {
				this.unhide( us );
			}
		}
	}

}

function createKoopaFactory( sprite ) {
	const walkAnim = sprite.animations.get( 'walk' );

	function routeAnim( koopa ) {
		if ( koopa.behavior.state === STATE_HIDING ) {
			return 'hiding';
		}

		return walkAnim( koopa.lifetime );
	}

	function drawKoopa( context ) {
		sprite.draw( routeAnim(this), context, 0, 0, this.vel.x < 0 );
	}

	return function createKoopa() {
		const koopa = new Entity();
		koopa.size.set( 16, 16 );
		koopa.offset.y = 8;

		koopa.addTrait( new PendulumWalk() );
		koopa.addTrait( new Killable() );
		koopa.addTrait( new Behavior() );

		koopa.draw = drawKoopa;

		return koopa;
	}
}