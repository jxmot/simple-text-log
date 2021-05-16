# simple-text-log

A Node.js package that provides simple text logging to a specified file. It has these features:

* Configurable - 
  * Log file name and location
  * Maximum log file size
* No external dependencies
* Small footprint

## Installation

`npm install simple-text-log`

## Usage

The code shown below was derived from the code found in `logtest.js` and `logtest2.js`.

```
// get the module...
const Log = require('simple-text-log');
const logOut = new Log(require('./runlogopt.js'));
```

```
module.exports = {
    logfile:'./logs/logfile.log',
    // 10 MiB file size
    logsize:10485760
};
```

**Note**: The path `./logs/` must be created prior to writing any log entries.

There are two functions provided in `Log`, `.writeTS()` and `.write()`. The only difference is that `.writeTS()` will create a time stamp at the start of each log entry. And `.write()` does not. The time stamp looks like this - 

**`[20210515-012455.739]: `**`The rest of the log entry is here.`

Here is some code that creates a *common* function that calls `.writeTS()` but adds the name of the file that the code is running in:

```
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
```

Here is an example of a log entry using the code above:

**`[20210515-012455.739]: logtest.js - `**`test message 1`

Found in **`logtest.js`**: 

```
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
```

The log file will contain:

```
[20210515-012455.737]: logtest.js - *******************************************
[20210515-012455.739]: logtest.js - begin app init
[20210515-012455.739]: logtest.js - test message 1
[20210515-012455.739]: logtest.js - test message 2
[20210515-012455.740]: logtest.js - test message 3
[20210515-012455.740]: logtest.js - test message 4
[20210515-012455.740]: logtest.js - test message 5
```

## Usage Recommendation

It is not necessary to require `simple-text-log` in every module within your application. If all of your modules' log entries are expected to be in the same log file then passing the `log()` function to each module.

Example:

Found in **`logtest.js`**: 

```
/* ********************************************************
    Passing the logger function to other modules
*/
const tmp = require('./logtest2.js');
tmp(logOut);
```

**`logtest2.js`**: 

```
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
```

The log file will contain:

```
[20210515-012455.741]: logtest2.js - init 2
[20210515-012455.742]: logtest2.js - test 2 message 1
[20210515-012455.742]: logtest2.js - test 2 message 2
[20210515-012455.743]: logtest2.js - test 2 message 3
[20210515-012455.743]: logtest2.js - test 2 message 4
[20210515-012455.743]: logtest2.js - test 2 message 5
```

## Log File Size Management

The maximum size of the *active* log file can be limited, or left unmanaged by changing the configuration. For example, if your configuration looks like this - 

```
module.exports = {
    logfile:'./logs/logfile.log',
    // 10 MiB file size
    logsize:10485760
};
```

Then when `./logs/logfile.log` exceeds the size set in `logsize` it will be renamed `./logs/logfile-YYYYMMDD-HHMMSS.log`. A *new* `./logs/logfile.log` will be created when the next log entry is written.

However, if `logsize` is `0` then the log file size is not managed and it will continue to grow. The size is only limited by your particular platform. This is **not** recommended in most usage scenarios.

---
<img src="http://webexperiment.info/extcounter/mdcount.php?id=simple-text-log">
