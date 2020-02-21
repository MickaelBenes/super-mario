import {Sides, Trait} from '../Entity.js';

export default class PendulumMove extends Trait {

    constructor() {
        super('pendulumMove');

        this.speed = -30;
        this.enabled = true;
    }

    obstruct(entity, side) {
        if (side === Sides.LEFT || side === Sides.RIGHT) {
            this.speed = -this.speed;
        }
    }

    update(entity) {
        if (this.enabled) {
            entity.vel.x = this.speed;
        }
    }
}