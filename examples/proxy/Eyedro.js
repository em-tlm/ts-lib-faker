let Promise = require('bluebird');
let superagent = require('superagent');

class Eyedro {
    constructor(options) {
        this.endpoint = options.endpoint;
        this.userKey = options.userKey;
        this.cmd = options.cmd;
    }

    getData(startTime, endTime) {
        startTime = Math.floor(startTime / 1000);
        endTime = Math.floor(endTime / 1000);
        url = this.endpoint;
        let query = {
            Cmd: cmd,
            DateStartSecUtc: startTime,
            DateStopSecUtc: endTime,
            UserKey: this.userKey
        };
        return new Promise(function (resolve, reject) {
            superagent.get(url).query(query).end(function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    let data = JSON.parse(res.text).Data;
                    _.each(data, function (dataArray, serial) {
                        _.each(dataArray, function (dataForDevice, index) {

                            let fullSerial = formatSerial(serial, index);
                            let deviceId = fromSerialToDeviceId(fullSerial);
                            let datum = {deviceId: deviceId, data: dataForDevice};
                            // format the data such that it matches the expectation of the proxy
                        });
                    });
                    resolve(data);
                }
            });
        })
    }
}

function formatSerial(){

}

function fromSerialToDeviceId(){

}

module.exports = Eyedro;