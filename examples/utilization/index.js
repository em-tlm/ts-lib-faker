'use strict'
/**
 * Created by doug on 4/30/17
 */

const superagent  = require('superagent');
const sec = 1000;
const min = 60 * sec;

const Faker = require('../../Faker.js');
const FixedValueStrategy = require('../../strategies/FixedValueStrategy.js');

const API_KEY = '';
const URL = '';


const strategy = new FixedValueStrategy({
    values: [2, 1, 0],
    cycle_type: 'sequential',
    period_cycle: (15 * 60) / 5, // change every 15min at 5/s a tick.
});


const faker = new Faker({
    strategy: strategy,
    interval: 5 * sec, // 5s intervals
});

const postData = {
    api_key: API_KEY,
    data: []
};

faker.on('new_data',(data) => {
    console.log(postData);
    superagent.post(URL)
        .send(postData)
        .set('Accept', 'application/json')
        .end((err, res) => {
            if(err) console.error(err);
            if(res) console.log(res.body);
        });
});

faker.begin();

setTimeout(faker.end.bind(faker), 48 * 60 * min); // 48 hours
