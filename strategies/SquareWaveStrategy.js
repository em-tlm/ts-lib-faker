/**
 * Created by spin on 3/12/17.
 */

"use strict";

const Strategy = require('../Strategy.js');

const oneHour = 1 * 60 * 60 * 1000;

class SquareWaveStrategy extends Strategy {
    /**
     * Constructor for this strategy. The options object should contain
     * - period_count
     * - duty_cycle
     * - high_value
     * - low_value
     * @param options
     */
    constructor(options){
        options = options || {};

        super(options);

        if (! (options.period_count > 1) ){
            throw new Error('each period must have more than 1 data point');
        }

        this.period_count = options.period_count || Math.round( oneHour / 5000);

        if ( options.duty_cycle > 1 || options.duty_cycle < 0) {
            throw new Error('each period must have more than 1 data point');
        }

        this.duty_cycle = options.duty_cycle || 0.5; // percentage, value equals highValue

        this.low_value = options.low_value || 0;

        this.high_value = options.high_value || this.low_value * 2;

        this.variation = options.variation || (this.high_value - this.low_value) * 0.05;
    }

    /**
     * Generate a value based on the strategy for a given count
     * @param {number} count The count of the time series data point
     * @returns {number}
     * @private
     */
    _generateValue(count) {
        let value;

        count = count % this.period_count;

        if (count < Math.round(this.period_count * this.duty_cycle)) {

            value = this.high_value
        } else {

            value = this.low_value
        }

        value += this.variation * Math.random() - 0.5 * this.variation;

        return value;
    }

    /**
     * Return an array of value points given the start and stop count number.
     * Value point object looks like this { value: 5, timestamp: 1489634780863 }.
     * @param {object} faker
     * @param {number} startCount The count corresponding to the start time
     * @param {number} stopCount The count corresponding to the stop time
     * @returns {object[]} An array of value point objects
     */
    getValueAry(faker, startCount, stopCount){
        let valueAry = [];

        for (let i = startCount; i <= stopCount; i++){
            let count = i;

            valueAry.push({
                count: count,
                value: this._generateValue(count)
            });
        }

        return valueAry;
    }

    /**
     * Generate a value point object based on the faker's current counter
     * according to the strategy.
     * @param {object} faker
     * @returns {object} A value point object, i.e, {count: number, value: number}
     */
    generateValue(faker){
        let count = faker.getCounter();
        return {
            count: count,
            value: this._generateValue(count)
        }
    }


}

module.exports = SquareWaveStrategy;