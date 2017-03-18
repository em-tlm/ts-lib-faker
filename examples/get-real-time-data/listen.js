'use strict';

let RandomStrategy = require('../../strategies/RandomStrategy.js');
let Faker = require('../../Faker.js');
let rand = new RandomStrategy();
let faker = new Faker({
    strategy: rand,
    interval: 2000
});

faker.on('new_data',function(data){
    console.log(data);
});

faker.begin();

setTimeout(faker.end.bind(faker), 5*1000);