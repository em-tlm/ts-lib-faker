# ts-faker

## (Please feel free to contribute to this repo and/or make feature requests)

Define a strategy or use one of the existing strategies, then create a time series data faker 
use that strategy. 


## Faker
### `new Faker(options)`
Constructor. 
* `interval`: the interval between data points, in ms. For example 5000.

### `getData(startTime, stopTime)`

### `Event: "new_data"`
The `new_data` callback is called with the data point object whenever there is a 
new data point. 

## Strategies
The faker supports the *following strategies*

### `Random`
It supports the following distributions
  * Uniform distribution 
  * Normal distribution (in progress)

### `Square wave`

```
let SquareWaveStrategy = require('../../strategies/SquareWaveStrategy.js');
let squareWave = new SquareWaveStrategy({
    period_count: 60*1000 / 5000, // period is 1 min
    duty_cycle: 0.3,              // percent of time the value is at high_value
    high_value: 20,               // high value of the square wave
    low_value: 5,                 // low value of the square wave
    variation: 1                  // introduce a little noise to the square wave
});
```

### `Sine`



### `File`

You can just put new strategies in the `strategies` folder. 


## Examples

Here is a one simple example
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

More examples can be found in the ts-faker/examples folder

## Basic concepts

### Value point 
```
{ 
     count: 10,
     value: 5,
}
``` 
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