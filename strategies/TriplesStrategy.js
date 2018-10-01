'use strict';

const fs = require('fs');
const _ = require('lodash');
const handlebars = require('handlebars');
const Strategy = require('../Strategy.js');

class TriplesStrategy extends Strategy {

    constructor(options) {
        options = options || {};
        super(options);

        this.ttlTemplateFile = options.ttlTemplateFile;
        this.validatePathArgument(this.ttlTemplateFile, "ttlTemplateFile");

        this.jsonFile = options.jsonFile;
        this.validatePathArgument(this.jsonFile, "jsonFile");

        this.ttlFileOutput = options.ttlFileOutput;
        this.validatePathArgument(this.ttlFileOutput, "ttlFileOutput");
    }

    validatePathArgument(argumentValue, argumentName) {
        if (!argumentValue) {
            throw new Error(`Missing argument "${argumentName}"`);
        }
        if (!fs.existsSync(argumentValue)) {
            throw new Error(`File ${argumentValue} does not exist.`);
        }
    }

    generateValue(tsLibFaker) {
        let sourceTtlTemplate = fs.readFileSync(this.ttlTemplateFile, 'utf8');
        let template = handlebars.compile(sourceTtlTemplate);

        let sourceJson = fs.readFileSync(this.jsonFile, 'utf8');
        let ttlContent = template(JSON.parse(sourceJson));

        let fileOutput = `${this.ttlFileOutput}/0.ttl`;
        fs.writeFileSync(fileOutput, ttlContent);

        return {
            count: tsLibFaker._counter,
            value: fileOutput
        }
    }
}

module.exports = TriplesStrategy;
