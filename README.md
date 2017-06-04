# ts-faker
[![Build Status](https://travis-ci.org/tetrascience/ts-faker.svg?branch=master)](https://travis-ci.org/tetrascience/ts-faker)

Create a time series data stream. Here are the highlights:
 
* support comprehensive strategies for [random](#random), [sinusoidal](#sine), square wave, file
* support user defined strategies 

## Usage
```bash
npm install tetrascience/ts-faker
```

Here is a one simple example
```javascript
const min = 60*1000;

const Faker = require('ts-faker');
const SineStrategy = Faker.strategies.Sine;

const sine = new SineStrategy({
    period_count: 10,
    amplitude: 1000,
    phase_shift: Math.PI
});
const faker = new Faker({
    strategy:sine,
    interval: 5000
});
faker.begin();
setTimeout(faker.end, 2 * min);

const now = new Date().getTime();
const oneMinAgo = now - 1 * min;

faker.getData(oneMinAgo, now); 
// return [], since faker was not began during that time range

setTimeout(faker.getData.bind(faker,oneMinAgo, now), 1 * min);
// return [dp1, dp2, ....] 

faker.on("new_data",function(datapoint){
    console.log(datapoint)
});
```

More examples can be found in the [examples](/examples) folder

## Faker
Every faker has one simple job -- keeps ticking based on user specified interval. 
Every time faker ticks, it leverages the [strategy](#strategies) to generate a [data point](#data-point) 
and its counter gets incremented. 

### `new Faker(options)`
The constructor takes the following options to create a faker. 
* `interval`: the interval between data points, in ms. For example 1000. Default is 5000.
* `strategy`: the strategy object that generate the fake data at each tick of the faker. 
You can pick from the [ones support natively](#Strategies).

### `getData(startTime, stopTime)`
Retrieve the data within a certain time range.
* Output: an array of [data points](#data-point) in the time range. 

### `Event: "new_data"`
The `new_data` event will be emitted with a [data point](#data-point) whenever there is a 
new data point generated.  

## Strategies
Strategy does not have the concept of time. It's only aware of counts (the number of ticks that the faker has experienced).

### Strategy API
Each strategy must support the following APIs.

#### `generateValue(faker)`
Generate a value point based 
* Input: a faker object
* Output: a [value point](#value-point)

#### `getValueAry(faker, startCount, stopCount)`
* Input: a the faker object, start count and stop count
* Output: an array of [value points](#value-point)



### Strategies available
The faker supports the *following strategies*
#### `Random`
It supports the following distributions
  * Uniform distribution 
  * Normal distribution (in progress)

#### `Square wave`

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

#### `Sine`
#### `File`
#### `Fixed values`

### Contribute your strategy
You can just put new strategies in the `strategies` folder. 



## Basic concepts

### Value point 
```javascript
{ 
     count: 10,
     value: 5 // The value can be string or buffer, such as `new Buffer("humdity:60%")`. 
}
``` 
### Data point 
Data point is always an object that has a timestamp and a value.
```javascript
{
    timestamp: new Date().getTime(), // time in ms 
    value: 0.5
}
```

The value can be string or buffer, such as `new Buffer("humdity:60%")`. 
```javascript
{
    timestamp: new Date().getTime(), // time in ms
    value: "error: water level low"
}
```

## Todo 
* add support for 1111000022222
* add unit test for the strategies.
* support type buffer
