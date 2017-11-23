import { Trait } from '../Entity.js';

export default class Killable extends Trait {

	constructor() {
		super( 'killable' );

		this.dead = false;
	}

	kill() {
		this.dead = true;
	}

}