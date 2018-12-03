'use strict';

const fs = require('fs');
const _ = require('lodash');
const handlebars = require('handlebars');
const Strategy = require('../Strategy.js');

/**
 * Class that implements TTL file generation strategy. It accepts TTL template file, output folder location and list
 * of JSON file to use against given template file. Number of output TTL files is equal to number of input JSON files.
 */
class TriplesStrategy extends Strategy {

    /**
     * Constructor for strategy
     *
     * @param {object} options
     */
    constructor(options) {
        options = options || {};
        super(options);

        this.ttlTemplateFile = options.ttlTemplateFile;
        this.validatePathArgument(this.ttlTemplateFile, "ttlTemplateFile");

        this.jsons = options.jsons;

        this.ttlFileOutput = options.ttlFileOutput;
        this.validatePathArgument(this.ttlFileOutput, "ttlFileOutput");
    }

    /**
     * Validates path based argument - if it is provided and if path exists
     *
     * @param {string} argumentValue
     * @param {string} argumentName
     */
    validatePathArgument(argumentValue, argumentName) {
        if (!argumentValue) {
            throw new Error(`Missing argument "${argumentName}"`);
        }
        if (!fs.existsSync(argumentValue)) {
            throw new Error(`File ${argumentValue} does not exist.`);
        }
    }

    /**
     * Generates TTL files based on given input
     *
     * @param {object} tsLibFaker
     * @returns {{count: number, value: Array}}
     */
    generateValue(tsLibFaker) {
        let sourceTtlTemplate = fs.readFileSync(this.ttlTemplateFile, 'utf8');
        let template = handlebars.compile(sourceTtlTemplate);

        let fileOutputs = [];
        this.jsons.forEach((jsonInput, index) => {
            let ttlContent = template(jsonInput);

            let fileOutput = `${this.ttlFileOutput}/${index}.ttl`;
            fs.writeFileSync(fileOutput, ttlContent);

            fileOutputs.push(fileOutput);
        });

        return {
            count: tsLibFaker._counter,
            value: fileOutputs
        }
    }
}

module.exports = TriplesStrategy;
