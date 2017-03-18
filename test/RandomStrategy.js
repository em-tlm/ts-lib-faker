"use strict";

let chai = require('chai');
let expect = chai.expect;

let RandomStrategy = require('../strategies/RandomStrategy.js');

describe('RandomStrategy', function () {

    let randomStrategy = new RandomStrategy({
        distribution: {
            type: 'uniform',
            max: 5,
            min: 2
        }
    });

    let faker = {
        counter: 10,
        interval: 5000,
        t0: new Date().getTime() - this.counter * this.interval
    };


    it('should generate value that is in the range', function (done) {
        for (let i=0; i<1; i++) {
            let valuePoint = randomStrategy.generateValue(faker);
            expect(valuePoint.value).to.be.above(2);
            expect(valuePoint.value).to.be.below(5);
            expect(valuePoint).to.have.property('count');
        }
        done();
    });



    it('should return the correct number of datapoints', function(done){
        let startCount = 1;
        let stopCount = 10;
        let dataAry = randomStrategy.getValueAry(faker, startCount, stopCount);
        expect(dataAry.length).to.equal(10);
        done();
    });
});