/**
 * Created by spin on 3/12/17.
 */

"use strict";
const superagent = require('superagent');
const path = require('path');
const fs = require('fs');



setInterval(function(){
    let now = Math.round( new Date().getTime()/1000 );
    superagent
        .get('localhost:3001')
        .query({ DateStartSecUtc: now - 10  })
        .query({ DateStopSecUtc: now})
        .end(function(err, res){
            console.log(res.body);
        });
}, 10000);
