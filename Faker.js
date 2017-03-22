'use strict';

const EventEmitter = require('events');
const _ = require('lodash');

class Faker extends EventEmitter {
    constructor(options) {
        super();
        options = options || {};

        this.setStrategy(options.strategy);

        // the start time of the time series feed
        this.t0 = options.t0 || new Date().getTime();

        // by default data point has 5 sec interval
        if (_.isUndefined(options.interval)) {
            options.interval = 5000;
        }

        options.interval = parseInt(options.interval);

        if (_.isNaN(options.interval)) {
            throw new Error('offset_count can not be parsed into an integer');
        }
        if (options.interval < 200) {
            throw new Error('interval can not be lower than 200 ms');
        }
        this.interval = options.interval;

        // fast forward this many counts, currently NOT used and NOT tested
        options.offset_count = parseInt(options.offset_count);
        if (_.isNaN(this.offset)) {

        }
        if (options.offset_count < 0) {
            throw new Error('offset_count must be a positive integer');
        }
        this.offset_count = options.offset_count || 0;
        this.offset_time = options.offset_time || this.offset_count * this.interval || 0;

        this.counter = 0 + this.offset_count;


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
        return this.mostRecentDataPoint;
    }

    // start generating time series data
    begin() {
        // kick off the time series data
        // first wait for the offset
        // then generate data periodically
        let self = this;
        self.timer1 = setTimeout(()=> {

            self.timer2 = setInterval(()=> {

                self._fake();

            }, self.interval, true);

            self._fake();

        }, self.offset_time);
        self.t0 = new Date().getTime();
    }

    // generate a data point based on strategy
    _generateDataPoint() {
        let valuePoint = this._strategy.generateValue(this);
        let dataPoint = {
            timestamp: valuePoint.count * this.interval + this.t0,
            value: valuePoint.value
        };
        return dataPoint;
    }

    _fake() {
        let self = this;
        let datapoint = self._generateDataPoint();
        self.mostRecentDataPoint = datapoint;
        self.counter++;
        self.emit('new_data', datapoint);
    }


    getData(start, stop) {
        let self = this;
        let now = new Date().getTime();
        if (!_.isNumber(start) || !_.isNumber(stop)){
            throw new Error("getData(start,stop) must take numbers as arguments");
        }
        if (stop < start){
            throw new Error("stop can not be an earlier time than start");
        }

        // no data before the faker was began
        if (stop <= this.t0) {
            return [];
        }
        // no data for the future
        if (start > now) {
            return [];
        }

        // make start the faker's begin time
        if (start <= this.t0) {
            start = this.t0;
        }

        // make stop the current time, since now data in the future should be available
        if (stop >= now) {
            stop = now;
        }

        // todo: add caching
        // todo: ignore the paused time

        let startCount = Math.ceil( (start - this.t0) / this.interval );
        let stopCount = Math.floor( (stop - this.t0) / this.interval );

        // this can happen when start and stop are both within the same interval, namely between two counts
        if (startCount > stopCount) {
            return [];
        }
        let valueAry = this._strategy.getValueAry(this, startCount, stopCount);

        let dataAry = valueAry.map(function(dp){
            return {
                timestamp: dp.count * self.interval + self.t0,
                value: dp.value
            }
        });
        return dataAry;
    }


    end() {
        if (this.timer1) {
            clearTimeout(this.timer1);
        }
        if (this.timer2) {
            clearInterval(this.timer2);
        }
    }

    pause() {
        // todo: how to pause a setInterval?
    }


}

module.exports = Faker;










