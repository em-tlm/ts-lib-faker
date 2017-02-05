'use strict';

const _ = require('lodash');

let Strategy = require('../Strategy.js');


class RandomStrategy extends Strategy {


    constructor(options){
        const UNIFORM = 'uniform';
        options = options || {};
        super(options);
        if (options.distribution && options.distribution.type) {
            this.distribution = options.distribution;
        } else {
            this.distribution = {type: UNIFORM,max:1,min:0};
        }
    }



    getRawData(faker,start,stop){
        let interval = faker.interval;

        let now = new Date().getTime();
        let dataAry = [], pts;

        if ( now > start && now < stop ){
            pts = Math.round(now-start)/interval;
        } else {
            pts = Math.round(stop-start)/interval;
        }
        let startCount = Math.ceil(start/interval);
        for (let i=0; i<pts; i++){
            let timestamp = (startCount+i) * interval;
            dataAry.push({
                timestamp : timestamp,
                value: generateValue()
            })
        }

        return dataAry;
    }

    generateDataPoint(faker){
        return {
            timestamp: faker.counter * faker.interval + faker.offset_time,
            value: this.generateValue()
        }
    }

    generateValue(){
        return distributions[this.distribution.type](this.distribution);
    }
}

let distributions = {
    'uniform': function(distribution){
        let max = distribution.max;
        let min = distribution.min;
        let range = max - min;
        let value = min + range* Math.random();
        return value;
    },

    'normal': function(distribution){
        // todo: needs to actually generate normal distribution
        let mean = distribution.mean;
        let std = distribution.standard_deviation;
        return 1;
    }
};

module.exports = RandomStrategy;

