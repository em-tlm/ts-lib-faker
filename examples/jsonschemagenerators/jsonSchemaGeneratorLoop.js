/*
Example of Json schema based strategy used to generate data in loop
 */
'use strict';

const JsonSchemaBasedRandomStrategy = require('../../strategies/JsonSchemaBasedRandomStrategy.js');
const defaultJsonDeviceSchema = require('../../schemas/deviceSchema.js');
const Faker = require('../../Faker.js');

let jsonSchemaStrategy = new JsonSchemaBasedRandomStrategy({
    jsonSchema : defaultJsonDeviceSchema,
    dataCount: 5
});
let faker = new Faker({
    strategy: jsonSchemaStrategy,
    interval: 2000
});

faker.on('new_data',function(data){
    console.log(data);
});

faker.beginAsync();

setTimeout(faker.end.bind(faker), 5000);
