'use strict';
/*
    Run-Time Logging Test & Demonstration

    The code found here uses the "Log" module. Please see 
    "Log.js" for complete usage details.
*/
// get the module...
const Log = require('simple-text-log');
const logOut = new Log(require('./runlogopt.js'));

/*
    The following code inserts this file's name into
    the log message. It is not requried, but it makes
    it easier to trace the origin of the log messages.
*/
const path = require('path');
const scriptName = path.basename(__filename);
function log(payload) {
    logOut.writeTS(`${scriptName} - ${payload}`);
};

/* ********************************************************
    Test & Demonstration
*/
// start logging
log('*******************************************');
log(`begin app init`);
// create some log entries...
var testcount = 0;
log(`test message ${testcount += 1}`);
log(`test message ${testcount += 1}`);
log(`test message ${testcount += 1}`);
log(`test message ${testcount += 1}`);
log(`test message ${testcount += 1}`);

/* ********************************************************
    Passing the logger function to other modules
*/
const tmp = require('./logtest2.js');
tmp(logOut);
