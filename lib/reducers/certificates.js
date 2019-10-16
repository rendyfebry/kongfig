'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _certificates = require('../parsers/certificates');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var sni = function sni(state, log) {
    var _log$params = log.params,
        type = _log$params.type,
        _log$params$endpoint = _log$params.endpoint,
        params = _log$params$endpoint.params,
        body = _log$params$endpoint.body,
        content = log.content;


    if (state._info.id != content.ssl_certificate_id) {
        return state;
    }

    switch (type) {
        case 'remove-certificate-sni':
            return _extends({}, state, { snis: state.snis.filter(function (x) {
                    return x.name !== content.name;
                }) });
        case 'add-certificate-sni':
            return _extends({}, state, { snis: [].concat(_toConsumableArray(state.snis), [{ name: content.name }]) });
        default:
            state;
    }

    return state;
};

exports.default = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var log = arguments[1];

    if (log.type !== 'response') {
        return state;
    }

    var _log$params2 = log.params,
        type = _log$params2.type,
        _log$params2$endpoint = _log$params2.endpoint,
        params = _log$params2$endpoint.params,
        body = _log$params2$endpoint.body,
        content = log.content;


    switch (type) {
        case 'create-certificate':
            return [].concat(_toConsumableArray(state), _toConsumableArray((0, _certificates.parseCertificates)([content])));

        case 'remove-certificate-sni':
        case 'add-certificate-sni':
            return state.map(function (state) {
                return sni(state, log);
            });
        default:
            return state;
    }
};