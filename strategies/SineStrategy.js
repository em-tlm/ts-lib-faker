'use strict';
const _ = require('lodash');

let Strategy = require('../Strategy.js');
const PI = Math.PI;

class SineStrategy extends Strategy {

    constructor(options) {
        options = options || {};
        super(options);
        this.amplitude = options.amplitude || 5;
        this.mean = options.mean || 18;
        this.period_count = options.period_count || 10;
        this.phase_shift = options.phase_shift || 0;
    }

    getValueAry(faker, startCount, stopCount) {

    }

    generateValue(faker) {
        return {
            count: faker.counter,
            value: this._generateValue(faker.counter, faker.interval)
        }
    }

    _generateValue(counter, interval) {
        let phase = this.phase_shift + ( counter * interval / (this.period_count * interval) ) * ( 2 * PI);
        return Math.sin(phase);
    }
}

module.exports = SineStrategy;