/**
 * Created by spin on 1/30/17.
 */
'use strict';

let chai = require('chai');
let expect = chai.expect;

let Strategy = require('../Strategy.js');

describe('Strategy',function(){

    let strategy = new Strategy({
        offset_time: 100,
        interval: 200
    });

    describe('strategy.begin',function(){
        afterEach(function(){
            strategy.end();
        });

        it('should be able to end after begin', function(done){
            strategy.generateValue = ()=>{ throw new Error('faker not stopped properly')};
            strategy.begin();
            setTimeout(done,120);
            strategy.end();
        });

        it('should be able to wait for the offset',function(done){
            strategy.generateValue = done;
            strategy.begin();
        });

        it('should be able to generate data periodically', function(done){
            let count = 0;
            strategy.generateValue = function(){ count++; };
            strategy.begin();
            setTimeout(function(){
                expect(count).to.equal(1);
                done();
            },400)
        });
    });
});