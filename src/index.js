'use strict';
/* ************************************************************************ */
/*
    https://github.com/jxmot/simple-text-log

    
    

    Jim Motyl - https://github.com/jxmot
*/
function Log({logfile, logsize}) {

    this.file   = logfile;
    this.maxlog = logsize;

    var fs = require('fs');

    /*
        Return a string containing a time stamp. It can optionally
        incude seconds and milliseconds in the returned string.

        Usage:
            var stamp;

            // returns - 20161215-144210
            stamp = timeStamp(true);
            stamp = timeStamp(true, false);

            // returns - 20161215-144210.075
            stamp = timeStamp(true, true);

            // returns - 20161215-1442
            stamp = timeStamp();
            stamp = timeStamp(false);
            stamp = timeStamp(false, true);
    */
    function timeStamp(useSeconds = false, useMSeconds = false) {
        const d = new Date();
        const mnth = d.getMonth() + 1;
        const date = d.getDate();
        const hour = d.getHours();
        const minute  = d.getMinutes();

        var ts = '' + d.getFullYear() + (mnth < 10 ? '0'+mnth : mnth) + (date < 10 ? '0'+date : date) + '-' + (hour < 10 ? '0'+hour : hour) + (minute < 10 ? '0'+minute : minute);
        // use seconds?
        if(useSeconds === true) {
            const secs = d.getSeconds();
            ts = ts + (secs < 10 ? '0'+secs : secs);
            // use milliseconds?
            if(useMSeconds === true) {
                const msecs = d.getMilliseconds();
                ts = ts + '.' + (msecs < 10 ? '00'+msecs : (msecs < 100 ? '0'+msecs : msecs));
            }
        }
        return ts;
    };

    /*
        Clean up the text...

            Takes the source text and replaces several issue-prone
            characters or sequences with readable ones. The presence
            of those characters is dependent on where it came from 
            and the content of the text to be logged. 
    */
    function cleanText(src) {
        var res = src.replace(/“/g, '"').replace(/”/g, '"').replace(/’/g, '\'').replace(/&amp;/g, '&');
        return res;
    };

    /*
        Manage the file length... if the file reaches a 
        maximum size then it is renamed and a new log 
        file is created when the next entry is written
        to the file. 
    */
    function manageFile(file, maxsize) {
        // are we managing file file size?
        if(maxsize > 0) {
            // yes
            var archive = '';
            var stats = fs.statSync(file);
            if(stats.size > maxsize) {
                // find the '.' just before the extension
                // in the log file name
                var pos = -1;
                var found = false;
                while(!found) {
                    pos = file.indexOf('.', pos+1);
                    if(pos > 0) found = true;
                }
                // It's been found, now create a new time-stamped file name.
                // The time stamp will be after the last time stamped entry
                // in the file.
                archive = [file.slice(0, pos), '-'+timeStamp(true, false), file.slice(pos)].join('');
                // rename the old file to its archive name (time stamped)
                fs.renameSync(file, archive);
            }
            // return the log file path+name, and the path+name 
            // of the archived log file
            return [file, archive];
        } else {
            // file size is not managed, do nothing
            return [file, null];
        }
    };

    /*
        Write text to the log file and return the name of
        the file that was appended to.
    */
    this.write = function(text) {
        var textOut = '';

        // did the caller pass us any text?
        if(typeof text !== 'undefined') {
            // if 'text' is not a string, then an object is assumed
            if(typeof text !== 'string') text = JSON.stringify(text);
            if(text.length > 0) {
                // yes, did the caller put a newline at the end of the text?
                if(text.charAt(text.length - 1) !== '\n') {
                    // nope, add a newline
                    textOut = text+'\n';
                } else {
                    textOut = text;
                }
            } else {
                textOut = '\n';
            }
        } else {
            textOut = '\n';
        }
        // clean up the messy quotes
        var textClean = cleanText(textOut);
        // append the text to the log file,create it 
        // if necessary and check for errors
        fs.appendFileSync(this.file, textClean, {encoding: 'utf8'});
        // check the log file length, if too long then copy
        // it to a new name (time stamped) and truncate it.
        manageFile(this.file, this.maxlog);

        return this.file;
    };

    /*
        Write time stamped text to the log file and return 
        the name of the file that was appended to.
    */
    this.writeTS = function(text) {
        var lineTS = '['+timeStamp(true,true)+']: ';
        return this.write(lineTS + text);
    };
}

module.exports = Log;

