'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isValueSameOneArrayElement = function isValueSameOneArrayElement(a, b) {
    return typeof a === 'string' && Array.isArray(b) && b.length === 1 && !isValueDifferent(a, b[0]);
};

var isValueDifferent = function isValueDifferent(a, b) {
    if (Array.isArray(a)) {
        return !Array.isArray(b) || a.length != b.length || a.filter(function (x) {
            return b.indexOf(x) === -1;
        }).length > 0;
    }

    return JSON.stringify(a) !== JSON.stringify(b);
};

exports.default = function () {
    var defined = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var server = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var keys = Object.keys(defined);

    return keys.reduce(function (changed, key) {
        if (key === 'redirect_uri') {
            // hack for >=0.8.2 that allows multiple redirect_uris,
            // but accepts a string as well
            if (isValueSameOneArrayElement(defined[key], server[key])) {
                return changed;
            }
        }

        if (isValueDifferent(defined[key], server[key])) {
            return [].concat(_toConsumableArray(changed), [key]);
        }

        return changed;
    }, []);
};