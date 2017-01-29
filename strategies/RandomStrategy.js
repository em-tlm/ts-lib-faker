'use strict';

const _ = require('lodash');

let Strategy = require('../Strategy.js');


class RandomStrategy extends Strategy {


    constructor(options){
        const UNIFORM = 'uniform';
        options = options || {};
        super(options);
        this.distribution = (options.distribution && options.distribution.toLowerCase()) || {type: UNIFORM,max:1,min:0}
    }



    getRawData(start,stop){
        let interval = this.interval*1000;

        let value = generateValue();
        let pts = (stop-start)/interval;
        let startCount = Math.ceil(start/interval);
        let dataAry = [];
        for (let i=0; i<pts; i++){
            let timestamp = (startCount+i) * interval;
            dataAry.push({
                timestamp : timestamp,
                value: value
            })
        }
        return Promise.resolve(dataAry);
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

