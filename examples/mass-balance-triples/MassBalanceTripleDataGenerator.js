/*
Example of Json schema based strategy used to generate single data point
 */
'use strict';
const JsonSchemaBasedRandomStrategy = require('../../strategies/JsonSchemaBasedRandomStrategy.js');
const TriplesStrategy = require('../../strategies/TriplesStrategy.js');
const Faker = require('../../Faker.js');

// load JSON schemas for different models
const schemaUsers = require('./schemas/schemaUsers.json');
const schemaBalance = require('./schemas/schemaBalance.json');
const schemaProject = require('./schemas/schemaProject.json');
const schemaExperiment = require('./schemas/schemaExperiment.json');
const schemaWeighingMethod = require('./schemas/schemaWeighingMethod.json');
const schemaAssayMethod = require('./schemas/schemaAssayMethod.json');

// path to TTL template file
const TTL_TEMPLATE_PATH = './ttl/balance-template.ttl';

// path to output folder
const TTL_OUTPUT_FOLDER = './output';


// NOTE: following constants drive data generation - changing these values require model knowledge.
// Some value are common within generated data and therefore are marked as (pool). Number of experiments
// is actually the number of generated TTL data
const calibratorQualifierCount = 5; // number of qualifiers (pool)
const analystsCount = 50; // number of analysts (pool)
const weighingMethodCount = 10; // number of weighing methods (pool)
const assayMethodCount = 100; // number of assay methods (pool)
const balancesCount = 20; // number of balances (pool)
const projectsCount = 100; // number of projects (pool)
const experimentsCount = 2000; // number of experiments

/**
 * Gets custom data faker
 *
 * @param {object} jsonSchema JSON schema to use for appropriate strategy
 * @param {integer} dataCount Number of data to generate
 * @returns {Faker} Initialized faker
 */
function getCustomFaker(jsonSchema, dataCount) {
    let dataStrategy = new JsonSchemaBasedRandomStrategy({
        jsonSchema: jsonSchema,
        dataCount: dataCount
    });
    let dataFaker = new Faker({
        strategy: dataStrategy,
        interval: 2000
    });

    return dataFaker;
}

/**
 * Generates data
 *
 * @returns {Promise<{balances: Array, projects: Array, experiments: Array}>}
 */
async function generateData() {

    let weighingMethodFaker = getCustomFaker(schemaWeighingMethod, weighingMethodCount);
    let calibratorQualifierFaker = getCustomFaker(schemaUsers, calibratorQualifierCount);
    let analystFaker = getCustomFaker(schemaUsers, analystsCount);

    // create pools for common data - calibrator, analysts, weighing method
    let calibratorQualifierPool;
    let analystPool;
    let weighingMethodPool;

    // fake weighing methods
    weighingMethodFaker.on('new_data', function (data) {
        weighingMethodPool = data.value;
    });
    weighingMethodFaker.generateSingleDataAsync();

    // fake calibrator/qualifier roles users
    calibratorQualifierFaker.on('new_data', function (data) {
        calibratorQualifierPool = data.value;
    });
    calibratorQualifierFaker.generateSingleDataAsync();

    // fake analyst users
    analystFaker.on('new_data', function (data) {
        analystPool = data.value;
    });
    analystFaker.generateSingleDataAsync();

    // wait 2 seconds to resolve generated data
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));

    // create pool for assay method and randomly pick weighing method from the pool
    let assayMethodFaker = getCustomFaker(schemaAssayMethod, assayMethodCount);
    let assayMethodPool = [];
    assayMethodFaker.on('new_data', function (data) {
        let generatedAssayMethodPool = data.value;
        generatedAssayMethodPool.forEach(function (generatedAssayMethod, index) {
            let assayMethod = JSON.parse(generatedAssayMethod);
            // randomly pick weighing method from the pool
            assayMethod.weighingMethodName = JSON.parse(weighingMethodPool[Math.floor(Math.random() * weighingMethodCount)]).weighingMethodName;
            assayMethodPool.push(JSON.stringify(assayMethod));
        });
    });
    assayMethodFaker.generateSingleDataAsync();

    // wait two seconds for everything to finish
    await new Promise((resolve, reject) => setTimeout(resolve, 2000));

    // create main models - balances, projects, experiments

    let balanceFaker = getCustomFaker(schemaBalance, balancesCount);
    let projectFaker = getCustomFaker(schemaProject, projectsCount);
    let experimentFaker = getCustomFaker(schemaExperiment, experimentsCount);

    let balances = [];
    let projects = [];
    let experiments = [];

    // fake balances
    balanceFaker.on('new_data', function (data) {
        let generatedBalances = data.value;
        generatedBalances.forEach(function (generatedBalance, index) {
            let balance = JSON.parse(generatedBalance);
            // replace generated data for qualifier and calibrator with data from the calibrator/qualifier pool
            balance.balance.qualification.qualifier = JSON.parse(calibratorQualifierPool[Math.floor(Math.random() * calibratorQualifierCount)]);
            balance.balance.calibration.calibrator = JSON.parse(calibratorQualifierPool[Math.floor(Math.random() * calibratorQualifierCount)]);
            // replace owner with value from analyst pool
            balance.owner = JSON.parse(analystPool[Math.floor(Math.random() * analystsCount)]);
            balances.push(JSON.stringify(balance));
        });
    });
    balanceFaker.generateSingleDataAsync();

    // fake projects
    projectFaker.on('new_data', function (data) {
        projects = data.value;
    });
    projectFaker.generateSingleDataAsync();

    // fake experiments
    experimentFaker.on('new_data', function (data) {
        let generatedExperiments = data.value;
        generatedExperiments.forEach(function (generatedExperiment, index) {
            let experiment = JSON.parse(generatedExperiment);
            // replace measure process analyst with value from analyst pool
            experiment.measureProcess.analyst = JSON.parse(analystPool[Math.floor(Math.random() * analystsCount)]);
            // replace experiment method with value from the pool
            experiment.method = JSON.parse(assayMethodPool[Math.floor(Math.random() * assayMethodCount)]);
            experiments.push(JSON.stringify(experiment));
        });
    });
    experimentFaker.generateSingleDataAsync();

    await new Promise((resolve, reject) => setTimeout(resolve, 5000));

    return {
        balances,
        projects,
        experiments
    }

}


(async () => {
    let {
        balances,
        projects,
        experiments
    } = await generateData();

    let mergedJsons = [];
    // for each experiment, merge balance, project and experiment models in single JSON file
    experiments.forEach((experiment, index) => {
        let balance = balances[Math.floor(Math.random() * balancesCount)];
        let project = projects[Math.floor(Math.random() * projectsCount)];
        mergedJsons.push({
            ...JSON.parse(balance),
            ...JSON.parse(project),
            ...JSON.parse(experiment)
        });
    });

    // get triples generation strategy and use faked JSONs
    let triplesStrategy = new TriplesStrategy({
        ttlTemplateFile: TTL_TEMPLATE_PATH,
        jsons: mergedJsons,
        ttlFileOutput: TTL_OUTPUT_FOLDER
    });
    let faker = new Faker({
        strategy: triplesStrategy,
        interval: 2000
    });

    faker.on('new_data', function (data) {
        console.log(data);
    });

    faker.generateSingleDataAsync();
})();
