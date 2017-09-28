'use strict';

let chai = require('chai');
let expect = chai.expect;

let Faker = require('../Faker.js');

describe('faker', function () {

    const interval = 200;
    let count = 0;
    const dummyStrategy = {
        generateValue(){
            return {
                count: ++count,
                value: 1
            }
        }
    };

    let faker = new Faker({
        interval: interval,
        strategy: dummyStrategy
    });

    describe('faker.begin', function () {
        afterEach(function () {
            faker.end();
        });

        it('should be able to end after begin', function (done) {
            faker.begin();

            setTimeout(()=>{
                expect(faker.getCounter()).to.equal(1);
                done();
            }, interval * 1.5);

            setTimeout(()=>{
                faker.end()
            }, interval * 0.5);
        });

        it('should be able to generate data periodically', function (done) {
            let count = 0;
            faker.generateDataPoint = function () {
                count++;
            };
            faker.begin();
            setTimeout(function () {
                expect(count).to.equal(3);
                done();
            }, 500)
        });

        it("should not be able to get data for the future", function(done){
            faker.generateDataPoint = ()=>{};
            faker._strategy.getValueAry = ()=>{ throw new Error("this is future!")};
            faker.begin();
            let now = new Date().getTime();
            faker.getData(now+10*1000, now+15*1000);
            done();
        });

        it.skip("should not be able to get data before the faker began",function(done){
            faker._strategy.getValueAry = ()=>{ throw new Error("this is even before the faker began!")};
            faker.begin();
            let now = new Date().getTime();
            faker.getData(now-10*1000, now-5*1000);
            done();
        });

        it("should be able to get data in available time range",function(done){
            faker._strategy.getValueAry = done;
            faker.begin();
            let now = new Date().getTime();
            setTimeout(() => {
                faker.getData(now + 100, now + 700);
            },1*1000);
            done();
        });
    });
});
