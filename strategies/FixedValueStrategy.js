/**
 * Created by doug on 4/30/17
 */

"use strict";

const _ = require('lodash');
const Strategy = require('../Strategy.js');


class FixedValueStrategy extends Strategy {
    /**
     * Constructor for this strategy. The options object should contain
     * - values, The values this will cycle between.
     * - cycle_type, How to go thru the values array, currently on sequentially supported. TODO - random, etc.
     * - period_cycle, After how many ticks to go to next value.
     * @param options
     */
    constructor(options){
        options = options || {};

        super(options);

        if (! (options.values.length > 1) ){
            throw new Error('Must have options.values of array of length > 1');
        }

        this.values = options.values; // Array of values to go thru
        this.cycle_type = options.cycle_type || 'sequential';
        this.period_cycle = options.period_cycle || 5;
        this.current_index = 0;

        if (this.cycle_type === 'sequential') {
            this.values_order = _.range(this.values.length);
        } else {
            throw new Error('cycle_type must be sequential');
        }
    }

    /**
     * Generate a value based on the strategy for a given count
     * @param {count} count The count of the time series data point
     * @returns {number}
     * @private
     */
    _generateValue(count) {
        const value = this.values[this.values_order[this.current_index]];

        if ((count + 1) % this.period_cycle === 0) {
            this.current_index += 1;
        }

        if (this.current_index >= this.values.length) {
            // TODO - reset to 0 for sequential, but 'random' should probably be different behavior?
            this.current_index = 0;
        }
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
    getValueAry(faker, startCount, stopCount) {
        let valueAry = [];

        for (let i = startCount; i <= stopCount; i++){
            valueAry.push({
                count: i,
                value: this._generateValue(i)
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
        let count = faker.counter;
        return {
            count: count,
            value: this._generateValue(count)
        }
    }
}

module.exports = FixedValueStategy;
