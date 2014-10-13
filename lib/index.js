// Load modules


// Declare internals

var internals = {};


exports.serial = function (array, method, callback) {

    var il = array.length;
    if (!il) {
        callback();
    }
    else {
        var i = 0;
        var iterate = function () {

            var done = function (err) {

                if (err) {
                    callback(err);
                }
                else {
                    i += 1;
                    if (i < il) {
                        iterate();
                    }
                    else {
                        callback();
                    }
                }
            };

            method(array[i], done);
        };

        iterate();
    }
};


exports.parallel = function (array, method, callback) {

    var il = array.length;
    if (!il) {
        callback();
    }
    else {
        var count = 0;
        var errored = false;

        var done = function (err) {

            if (!errored) {
                if (err) {
                    errored = true;
                    callback(err);
                }
                else {
                    count += 1;
                    if (count === array.length) {
                        callback();
                    }
                }
            }
        };

        for (var i = 0; i < il; ++i) {
            method(array[i], done);
        }
    }
};


exports.parallelExec = function (fnObj, callback) {

    var result = {};
    if (!fnObj) {
        return callback(null, result);
    }

    var keys = Object.keys(fnObj);
    var fns =[];
    for (var i = 0, il = keys.length; i < il; ++i) {
        fns.push(fnObj[keys[i]]);
    }

    var fnExecute = function (fn, next) {

        fn(function (err, val) {

            if (err) {
                return next(err);
            }

            var index = fns.indexOf(fn);
            result[keys[index]] = val;
            return next();
        });
    };

    exports.parallel(fns, fnExecute, function (err) {

        if (err) {
            return callback(err);
        }

        return callback(null, result);
    });
};
