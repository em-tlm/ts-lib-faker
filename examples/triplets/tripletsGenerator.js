/*
Example of Json schema based strategy used to generate single data point
 */
'use strict';

const TriplesStrategy = require('../../strategies/TriplesStrategy.js');
const Faker = require('../../Faker.js');

// generate array of 2 devices based on schema
let tripletsStrategy = new TriplesStrategy({
    ttlTemplateFile : 'input.ttl',
    jsonFile: "input.json",
    ttlFileOutput: "./"
});
let faker = new Faker({
    strategy: tripletsStrategy,
    interval: 2000
});

faker.on('new_data',function(data){
    console.log(data);
});

faker.generateSingleData();

