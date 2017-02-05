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


    it('should generate value that is in the range', function (done) {
        for (let i=0; i<100; i++) {
            let value = randomStrategy.generateValue();
            expect(value).to.be.above(2);
            expect(value).to.be.below(5);
        }
        done();
    });

    it('should not return data when start is in the future', function(done){
        let dataAry = randomStrategy.getRawData({
            interval:5000,
            start:new Date().getTime()+10000,
            stop: new Date().getTime()+20000
        });
        expect(dataAry.length).to.equal(0);
        done();
    });

    it('should return the correct number of datapoints')

});