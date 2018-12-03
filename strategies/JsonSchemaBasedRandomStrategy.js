'use strict';

const _ = require('lodash');
const Strategy = require('../Strategy.js');
const defaultDeviceSchema = require('../schemas/deviceSchema.json');
const jsf = require('json-schema-faker');
const Chance = require('chance');
const Ajv = require('ajv');
const ajv = new Ajv;

/**
 * Json schema based random strategy. This strategy accepts valid JSON schema and generates JSON object based on
 * given schema. Strategy supports custom libraries fake.js and random.js.
 */
class JsonSchemaBasedRandomStrategy extends Strategy {

    /**
     * Base constructor for strategy
     *
     * @param {object} options
     */
    constructor(options) {
        options = options || {};
        super(options);
        this.jsonSchema = (options.jsonSchema) ? options.jsonSchema : defaultDeviceSchema;
        this.dataCount = (options.dataCount) ? options.dataCount : 10;

        this.validate = ajv.compile(this.jsonSchema);
        this.extendFieldFakerApi();
        this.extendFieldChanceApi();
    }

    /**
     * Method that generates value
     *
     * @param {object} tsLibFaker
     * @returns {Promise<{count: number, value: string[]}>}
     */
    async generateValue(tsLibFaker) {
        const resultArray = _.map(_.range(this.dataCount), () => jsf.resolve(this.jsonSchema));
        const objectArray = await Promise.all(resultArray);
        const value = objectArray.map(x => JSON.stringify(x));
        return {
            count: tsLibFaker._counter,
            value
        }
    }

    /**
     * Custom method that extends functionalities from fake.js library. Method is customized for following reasons:
     * 1. To output dates in ISO format
     * 2. To provide additional dates functions (last7 for date in last 7 days, and next7 for date in next 7 days)
     */
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
            faker.customDate = {
                next7 : () => {
                    let currentDate = Date.now();
                    let sevenDaysFromNow = currentDate + 7*24*60*60*1000;
                    return faker.date.between((new Date(currentDate)).toISOString(), (new Date(sevenDaysFromNow)).toISOString()).toISOString();
                },
                last7 : () => {
                    let currentDate = Date.now();
                    let sevenDaysBeforeNow = currentDate - 7*24*60*60*1000;
                    return faker.date.between((new Date(sevenDaysBeforeNow)).toISOString(), (new Date(currentDate)).toISOString()).toISOString();
                }
            }


            return faker;
        });
    }

    /**
     * Custom method that extends chance.js library.
     */
    extendFieldChanceApi() {
        jsf.extend('chance', () => new Chance());
    }

}

module.exports = JsonSchemaBasedRandomStrategy;
