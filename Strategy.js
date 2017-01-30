'use strict';

const EventEmitter = require('events');
const _ = require('lodash');

class Strategy extends EventEmitter {
    constructor(options) {
        super();
        options = options || {};

        // the start time of the time series feed
        this.t0 = options.t0 || new Date().getTime();

        // by default data point has 5 sec interval
        // todo: are these checking necessary?
        if (_.isUndefined(options.interval)) {
            options.interval = 5000;
        }
        options.interval = parseFloat(options.interval);
        if (_.isNaN(options.interval)) {
            throw new Error('offset_count can not be parsed into an integer');
        }
        if (options.interval < 100) {
            throw new Error('interval can not be lower than 0.1 sec（100 msec)');
        }
        this.interval = options.interval;

        // fast forward this many counts
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

    begin() {
        // kick off the time series data
        // first wait for the offset
        // then generate data periodically
        let self = this;
        self.timer1 = setTimeout(()=> {
            self.timer2 = setInterval(()=> {
                let datapoint = {
                    timestamp: new Date().getTime(),
                    value: self.generateValue()
                };
                self.emit('new_data', datapoint)
            }, self.interval)
        }, self.offset_time);
    }

    end() {
        if (this.timer1) {
            clearTimeout(this.timer1);
        }
        if (this.timer2) {
            clearInterval(this.timer2);
        }
    }

    getData(start, stop) {
        //todo: add caching
        return this.getRawData(start, stop);
    }

    reset() {
        // todo: start the time series data all over again
        this.counter = 0;
    }

    //todo: do we need to define generateValue here?
}

module.exports = Strategy;