/**
 * Created by spin on 1/29/17.
 */



let Faker = require('../../Faker.js');
let SineStrategy = require('../../Strategy/SineStrategy.js');
let Eyedro = require('./Eyedro.js');

let config = {
    isLocal: true
};

let eyedro = new Eyedro({
    url: 'https://my.eyedro.com/e2',
    userKey: 'tetrascience1bc42fd5f5114adda640954652c6',
    cmd: 'TetraScience.Pilot1'
});

let sine = new SineStrategy({
    period: 10,
    interval: 5,
    amplitude: 1000,
    phase_shift: Math.PI,
    t0: new Date().getTime() + 1*60*1000
});
sine.reset();
let faker = new Faker({
    strategy: sine
});
faker.begin();

let proxy;
if (config.isLocal) {
    proxy = faker;
} else {
    proxy = eyedro;
}

proxy.getData(start, stop).then(function (data) {
    console.log(`send data to queue`);
});