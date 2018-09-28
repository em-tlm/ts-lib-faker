/*
Example of Json schema based strategy used to generate single data point
 */
'use strict';

const JsonSchemaBasedRandomStrategy = require('../../strategies/JsonSchemaBasedRandomStrategy.js');
const defaultJsonDeviceSchema = require('../../schemas/deviceSchema.json');
const Faker = require('../../Faker.js');

// generate array of 2 devices based on schema
let jsonSchemaStrategy = new JsonSchemaBasedRandomStrategy({
    jsonSchema : defaultJsonDeviceSchema,
    dataCount: 2
});
let faker = new Faker({
    strategy: jsonSchemaStrategy,
    interval: 2000
});

faker.on('new_data',function(data){
    console.log(data);
});

faker.generateSingleDataAsync();

