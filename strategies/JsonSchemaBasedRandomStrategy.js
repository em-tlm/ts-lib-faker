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
        this.extendFieldFakerApi();
        this.extendFieldChanceApi();
    }

    async generateValue(tsLibFaker) {
        const resultArray = _.map(_.range(this.dataCount), () => jsf.resolve(this.jsonSchema));
        const objectArray = await Promise.all(resultArray);
        const value = objectArray.map(x => JSON.stringify(x));
        return {
            count: tsLibFaker._counter,
            value
        }
    }

    extendFieldFakerApi() {
        // Wrapper around faker.js library that contains
        // various algorithms for random generation.
        // Not to be confused with ts-lib-faker instance
        jsf.extend('faker', () => {
            const faker = require('faker');
            const dateIsoWrapper = object => {
                return new Proxy(object, {
                    get(target, propKey) {
                        let targetMethod = target[propKey];
                        if (typeof targetMethod === "function") {
                            return targetMethod().toISOString();
                        }
                        return targetMethod;
                    }
                })
            };
            faker.dateISO = dateIsoWrapper(faker.date);

            return faker;
        });
    }

    extendFieldChanceApi() {
        jsf.extend('chance', () => new Chance());
    }

}

module.exports = JsonSchemaBasedRandomStrategy;
