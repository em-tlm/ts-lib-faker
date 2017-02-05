'use strict';

let chai = require('chai');
let expect = chai.expect;

let Faker = require('../Faker.js');

describe('faker', function () {

    let faker = new Faker({
        offset_time: 100,
        interval: 200,
        strategy: {}
    });

    describe('faker.begin', function () {
        afterEach(function () {
            faker.end();
        });

        it('should be able to end after begin', function (done) {
            faker._generateDataPoint = ()=> {
                throw new Error('faker not stopped properly')
            };
            faker.begin();
            setTimeout(done, 120);
            faker.end();
        });

        it('should be able to wait for the offset', function (done) {
            faker._generateDataPoint = done;
            faker.begin();
        });

        it('should be able to generate data periodically', function (done) {
            let count = 0;
            faker._generateDataPoint = function () {
                count++;
            };
            faker.begin();
            setTimeout(function () {
                expect(count).to.equal(1);
                done();
            }, 400)
        });
    });
});
