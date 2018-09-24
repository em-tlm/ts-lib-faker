'use strict';

const _ = require('lodash');
const Strategy = require('../Strategy.js');
const defaultDeviceSchema = require('../schemas/deviceSchema.js');
const jsf = require('json-schema-faker');
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


    async generateValue(faker) {
        jsf.extend('faker', function() {
            return require('faker');
        });
        const resultArray = _.map(_.range(this.dataCount), () => jsf.resolve(this.jsonSchema));
        const value = await Promise.all(resultArray);
        return {
            count: faker._counter,
            value
        }
    }

}

module.exports = JsonSchemaBasedRandomStrategy;