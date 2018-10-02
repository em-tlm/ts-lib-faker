'use strict';

const _ = require('lodash');
const Strategy = require('../Strategy.js');
const defaultDeviceSchema = require('../schemas/deviceSchema.json');
const jsf = require('json-schema-faker');
const Chance = require('chance');
const Ajv = require('ajv');
const ajv = new Ajv;

class JsonSchemaBasedRandomStrategy extends Strategy {

    constructor(options) {
        options = options || {};
        super(options);
        this.jsonSchema = (options.jsonSchema) ? options.jsonSchema : defaultDeviceSchema;
        this.dataCount = (options.dataCount) ? options.dataCount : 10;

        this.validate = ajv.compile(this.jsonSchema);
    }

    async generateValue(tsLibFaker) {
        // Wrapper around faker.js library that contains
        // various algorithms for random generation.
        // Not to be confused with ts-lib-faker instance
        jsf.extend('faker', () => require('faker'));
        jsf.extend('chance', () => new Chance());
        const resultArray = _.map(_.range(this.dataCount), () => jsf.resolve(this.jsonSchema));
        const objectArray = await Promise.all(resultArray);
        const value = objectArray.map(x => JSON.stringify(x));
        return {
            count: tsLibFaker._counter,
            value
        }
    }

}

module.exports = JsonSchemaBasedRandomStrategy;
