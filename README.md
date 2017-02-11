# ts-faker

## (Please feel free to contribute to this repo and/or make feature requests)

Define a strategy or use one of the existing strategies, then create a time series data faker 
use that strategy. 

The faker supports the *following APIs* 
* getData(startTime, stopTime)
* .on("new_data",function(datapoint){})

The faker supports the *following strategies*
* Random
  * Uniform distribution 
* Sine
* File

You can just put new strategies in the `strategies` folder. 

```
const min = 60*1000;

let Faker = require('../../Faker.js');
let sine = new SineStrategy({
    period_count: 10,
    amplitude: 1000,
    phase_shift: Math.PI
});
let faker = new Faker({
    strategy:sine,
    interval: 5000
});
faker.begin();
setTimeout(faker.end, 2 * min);

let now = new Date().getTime();
let 1minAgo = now - 1 * min;

faker.getData(1minAgo, now); 
// return [], since faker was not began during that time range

setTimeout(faker.getData.bind(faker,1minAgo, now), 1*min);
// return [dp1, dp2, ....] 

faker.on("new_data",function(datapoint){
    console.log(datapoint)
})；

```

## Basic concepts 
### Data point 
Data point is always an object that has a timestamp and a value.
```
{
    timestamp: new Date().getTime(), // time in ms 
    value: 0.5
}
```

The value can be string or buffer, such as `new Buffer("humdity:60%")`. 
```
{
    timestamp: new Date().getTime(), // time in ms
    value: "error: water level low"
}
```

## Todo 
* add unit test for the strategies.
* support type buffer