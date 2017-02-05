# ts-faker

Define a strategy or use one of the existing strategies 

```
let Faker = require('../../Faker.js');
let sine = new SineStrategy({
    period: 10,
    interval: 5,
    amplitude: 1000,
    phase_shift: Math.PI,
    t0: new Date().getTime() + 1*60*1000
});
let faker = new Faker({strategy:sine});
faker.begin();

faker.getData(new Date().getTime()-5*60*1000, new Date());
faker.on(`new_data`,function(datapoint){
    console.log(datapoint)
})；
```

## Todo
* remove the concept of offset, since it's not needed. 
* add unit test for the strategies.