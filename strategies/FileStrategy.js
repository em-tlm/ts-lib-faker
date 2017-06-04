"use strict";

const _ = require('lodash');
const fs = require('fs');
const Strategy = require("../Strategy.js");

/**
 * should move counter and data array to faker class.
 */

class FileStrategy extends Strategy {
    constructor(options) {
        options = options || {};
        super(options);
        this.path = options.path;
        if (!fs.existsSync(this.path)) {
            throw new Error('file path does not exist');
        }
        if (!_.isBoolean(options.loop)) {
            throw new Error(`loop must be a boolean`);
        }
        this.loop = options.loop;

        this.loadData();
    }

    loadData() {
        if (!this.dataAry) {
            let tmp = fs.readFileSync(this.path).toString().split('\r\n');
            this.valueAry = tmp.map((row, index)=> {
                return {
                    count: index,
                    value: row
                }
            });
            this.valueAryLength = this.valueAry.length;
        }
    }

    getValueAry(faker, startCount, stopCount) {
        let valueAry = [];
        if (!this.loop) {
            if (startCount <= this.valueAryLength) {

                if (stopCount < this.valueAryLength) {
                    valueAry = this.valueAry.slice(startCount, stopCount + 1);
                } else {
                    valueAry = this.valueAry.slice(startCount, this.valueAryLength);
                }
            }
        } else {
            // when there is loop
        }
        return valueAry;
    }

    generateValuePoint(faker) {
        const fakerCounter = faker.getCounter();
        let counter = this.loop ? (fakerCounter % this.valueAry.length) : fakerCounter;
        let dataPoint = {
            count: fakerCounter,
            value: this.valueAry[counter].value
        };
        return dataPoint;
    }
}

module.exports = FileStrategy;