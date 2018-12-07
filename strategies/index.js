/**
 * Created by spin on 3/16/17.
 */

"use strict";
module.exports = {
    File: require('./FileStrategy.js'),
    Random: require('./RandomStrategy.js'),
    Sine: require('./SineStrategy.js'),
    SquareWave: require('./SquareWaveStrategy.js'),
    FixedValueStrategy: require('./FixedValueStrategy'),
    JsonSchemaBasedRandomStrategy: require('./JsonSchemaBasedRandomStrategy.js')
};
