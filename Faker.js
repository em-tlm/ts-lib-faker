'use strict';

const EventEmitter = require('events');
const _ = require('lodash');

class Faker extends EventEmitter {
    constructor(options) {
        super();
        options = options || {};

        // set strategy
        this.setStrategy(options.strategy);

        // interval determines the periodicity of the time series data
        // by default data point has 5 sec interval
        if (_.isUndefined(options.interval)) {
            options.interval = 5000;
        }

        options.interval = parseInt(options.interval);

        if (_.isNaN(options.interval)) {
            throw new Error('interval can not be parsed into an integer');
        }
        if (options.interval < 0) {
            throw new Error('interval can not be negative');
        }
        this._interval = options.interval;

        // counter keeps track how many data points have been generated
        this._counter = 0;
    }


    setStrategy(strategy) {
        if (strategy) {
            // todo: check strategy is valid
            this._strategy = strategy;
        } else {
            throw new Error(`${strategy} is not a valid strategy`);
        }
    }

    getMostRecentDataPoint(){
        return this._mostRecentDataPoint;
    }

    getCounter(){
        return this._counter;
    }

    getInterval(){
        return this._interval;
    }

    getT0(){
        return this.t0;
    }

    // begin generating time series data
    begin() {
        this.t0 = new Date().getTime(); // begin time
        this.timer = setInterval(()=> {
            this._fake();
        }, this._interval, true);
        this._fake();
    }

    // generate a data point based on strategy
    generateDataPoint() {
        let valuePoint = this._strategy.generateValue(this);
        let dataPoint = {
            timestamp: valuePoint.count * this._interval + this.t0,
            value: valuePoint.value
        };
        return dataPoint;
    }

    getData(start, stop) {
        let now = new Date().getTime();
        if (!_.isNumber(start) || !_.isNumber(stop)){
            throw new Error("getData(start,stop) must take numbers as arguments");
        }
        if (stop < start){
            throw new Error("stop can not be an earlier time than start");
        }

        // no data for the future
        if (start > now) {
            return [];
        }

        // make stop the current time, since now data in the future should be available
        if (stop >= now) {
            stop = now;
        }

        // todo: add caching
        // todo: ignore the paused time

        let startCount = Math.ceil( (start - this.t0) / this._interval );
        let stopCount = Math.floor( (stop - this.t0) / this._interval );

        // this can happen when start and stop are both within the same interval, namely between two counts
        // when startConut === stopCount, should still proceed, since there will be one data point
        if (startCount > stopCount) {
            return [];
        }
        let valueAry = this._strategy.getValueAry(this, startCount, stopCount);

        let dataAry = valueAry.map((dp) => {
            return {
                timestamp: dp.count * this._interval + this.t0,
                value: dp.value
            }
        });
        return dataAry;
    }


    end() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    //todo: add a pause method

    // private methods from this point on
    _fake() {
        const datapoint = this.generateDataPoint();
        this._mostRecentDataPoint = datapoint;
        this._counter++;
        this.emit('new_data', datapoint);
    }

}

module.exports = Faker;










