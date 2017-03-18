/**
 * Created by spin on 3/12/17.
 */

"use strict";
const fs = require('fs');
const express = require('express');
const path = require('path');
const _ = require('lodash');
var app = express();

const oneMin = 60 * 1000;
const oneHour = 60 * oneMin;
const oneDay = 24 * oneHour;

let Faker = require('../../Faker.js');
let SquareWaveStrategy = require('../../strategies/SquareWaveStrategy.js');
let squareWave = new SquareWaveStrategy({
    period_count: oneMin / 5000,
    duty_cycle: 0.3,
    high_value: 20,
    low_value: 5
});
let faker = new Faker({
    strategy: squareWave,
    interval: 5000
});

faker.begin();



/**
 *   curl http://localhost:3001?DateStartSecUtc=1476318530&DateStopSecUtc=1476318535
 *
 *   The possible behaviors should include
 *   - never return
 *   - 50X error
 *   - delay in 200 request
 */
app.get('/', function(req,res){

    // convert time to ms
    let startTime = req.query.DateStartSecUtc * 1000;
    let stopTime = req.query.DateStopSecUtc * 1000;

    // in most of the scenarios, return the data
    // add a random delay

    // the time series data will be in the form of
    //    [ { timestamp: 1489598896320, value: 20 },
    //      { timestamp: 1489598901320, value: 5 } ]
    let data = faker.getData(startTime,stopTime);

    res.send(data);
});

app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
});
