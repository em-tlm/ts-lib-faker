"use strict";

let chai = require('chai');
let expect = chai.expect;

let SquareWaveStrategy = require('../strategies/SquareWaveStrategy.js');

describe('RandomStrategy', function () {



    let squareWave = new SquareWaveStrategy({
        period_count: 60,
        duty_cycle: 0.3,
        high_value: 20,
        low_value: 5,
        variation: 1
    });

    let faker = {
        counter: 10,
        interval: 5000,
        t0: new Date().getTime() - this.counter * this.interval
    };


    it('should generate value that is in the range', function (done) {

        let valuePoint = squareWave.generateValue(faker);
        // based on faker.counter, this should be high value
        expect(valuePoint.value).to.be.above(squareWave.low_value);
        expect(valuePoint.value).to.not.equal(squareWave.high_value);
        done();
    });



    it('should return the correct number of datapoints', function(done){
        let startCount = 1;
        let stopCount = 60;
        let dataAry = squareWave.getValueAry(faker, startCount, stopCount);
        expect(dataAry.length).to.equal(60);
        done();
    });
});