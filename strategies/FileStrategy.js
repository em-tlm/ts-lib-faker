/**
 * Created by spin on 2/4/17.
 */

const _ = require('lodash');
const fs = require('fs');

/**
 * should move counter and data array to faker class.
 */

class FileStrategy extends Strategy{
    constructor(options){
        options = options || {};
        super(options);
        this.path = options.path;
        if (!fs.existsSync(this.path)){
            throw new Error('file path does not exist');
        }

        this.loop = options.loop;
        if (!_.isBoolean(this.loop)) {
            throw new Error(`loop must be a boolean`);
        }
        this.loadData();
    }

    loadData(){
        if (!this.dataAry){
            this.dataAry = fs.readFileSync(this.path).toString().split('\n');
        }

        return this.dataAry;
    }

    getRawData(start,stop){

    }

    generateDataPoint(faker){
        let datapoint =  {
            timestamp: new Date().getTime(),
            value: this.dataAry[faker.counter]
        };
        return datapoint;
    }
}

module.exports = FileStrategy;