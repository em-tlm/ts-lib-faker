'use strict';

const EventEmitter = require('events');

class Faker extends EventEmitter{
    constructor(options) {
        super();
        options = options || {};
        this.setStrategy(options.strategy);
    }


    setStrategy (strategy) {
        if (strategy) {
            // todo: check strategy is valid
            this._strategy = strategy;
            this._strategy.on('new_data', (data) => {
                this.emit('new_data', data);
            });
            this._strategy.on('start', (data) => {
                this.emit('start', data);
            });
        } else {
            throw new Error(`${strategy} is not a valid strategy`);
        }
    }


    // start generating time series data
    begin(){
        this._strategy.begin();
    }

    end(){
        this._strategy.end();
    }

    pause(){
        this._strategy.end();
    }

    getData(start, stop) {
        return this._strategy.getData(start, stop);
    }


}

module.exports = Faker;










