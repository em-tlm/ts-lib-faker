'use strict';

let chai = require('chai');
let expect = chai.expect;

let Faker = require('../Faker.js');

describe('faker', function () {

    let faker = new Faker({
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

        it('should be able to generate data periodically', function (done) {
            let count = 0;
            faker._generateDataPoint = function () {
                count++;
            };
            faker.begin();
            setTimeout(function () {
                expect(count).to.equal(3);
                done();
            }, 500)
        });

        it("should not be able to get data for the future", function(done){
            faker._generateDataPoint = ()=>{};
            faker._strategy.getValueAry = ()=>{ throw new Error("this is future!")}
            faker.begin();
            let now = new Date().getTime();
            faker.getData(now+10*1000, now+15*1000);
            done();
        });

        it("should not be able to get data before the faker began",function(done){
            faker._strategy.getValueAry = ()=>{ throw new Error("this is even before the faker began!")}
            faker.begin();
            let now = new Date().getTime();
            faker.getData(now-10*1000, now-5*1000);
            done();
        });

        it("should be able to get data in available time range",function(done){
            faker._strategy.getValueAry = done;
            faker.begin();
            let now = new Date().getTime();
            setTimeout(function(){
                faker.getData(now + 100, now + 700);
            },1*1000)
            done();
        });
    });
});
