/*
    Run-Time Logging Test & Demonstration

    Test #2

    Takes the logging function as an argument and 
    calls it to write entries into the log file that
    was set up previously.
*/
module.exports = (function(logOut) {
    // set up run-time logging for this module,
    // this is not requried but it helps when
    // determining the origin of a log entry.
    const path = require('path');
    const scriptName = path.basename(__filename);
    function log(payload) {
        logOut.writeTS(`${scriptName} - ${payload}`);
    };

    log(`init 2`);

    // create some log entries...
    let testcount = 0;
    log(`test 2 message ${testcount += 1}`);
    log(`test 2 message ${testcount += 1}`);
    log(`test 2 message ${testcount += 1}`);
    log(`test 2 message ${testcount += 1}`);
    log(`test 2 message ${testcount += 1}`);
});
