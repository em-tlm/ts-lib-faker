/**
 * Created by spin on 1/29/17.
 */
'use strict';

let RandomStrategy = require('../../strategies/RandomStrategy.js');
let Faker = require('../../Faker.js');
let rand = new RandomStrategy();
console.log(rand);
let faker = new Faker({
    strategy: rand
});

faker.on('new_data',function(data){
    console.log(data);
});

faker.begin();