/*
Example of Json schema based strategy used to generate data in loop
 */
'use strict';

const JsonSchemaBasedRandomStrategy = require('../../strategies/JsonSchemaBasedRandomStrategy.js');
const defaultJsonDeviceSchema = require('../../schemas/deviceSchema.json');
const Faker = require('../../Faker.js');

// generate array of 5 devices based on schema
let jsonSchemaStrategy = new JsonSchemaBasedRandomStrategy({
    jsonSchema : defaultJsonDeviceSchema,
    dataCount: 5
});

// generation takes place every two seconds
let faker = new Faker({
    strategy: jsonSchemaStrategy,
    interval: 2000
});

faker.on('new_data',function(data){
    console.log(data);
});

faker.beginAsync();

setTimeout(faker.end.bind(faker), 5000);
