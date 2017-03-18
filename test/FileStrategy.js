"use strict";

let chai = require('chai');
let expect = chai.expect;
let path = require("path");

let FileStrategy = require('../strategies/FileStrategy.js');

describe('FileStrategy', function () {

    let fileStrategy = new FileStrategy({
        path: path.join(__dirname, "files/ADVPRO-PLUS Sample Data Stream.txt"),
        loop: false
    });

    let faker = {
        t0: new Date().getTime(),
        counter: 1,
        interval: 5000
    };


    it("should be able to generate datapoint", function (done) {
        let datapoint = fileStrategy.generateDataPoint(faker);
        expect(datapoint.value).to.equal("SERIAL NUMBER: 000000<CR><LF>");
        expect(datapoint).to.have.property("timestamp");
        done();
    });

    it('should be able to return data', function (done) {
        let startCount = 1;
        let stopCount = 3;
        let valueAry = fileStrategy.getValueAry(faker, startCount, stopCount);
        expect(valueAry.length).to.equal(3);
        expect(valueAry[0]).to.have.property("count");
        expect(valueAry[0].value).to.equal("SERIAL NUMBER: 000000<CR><LF>");
        done();
    });


});
