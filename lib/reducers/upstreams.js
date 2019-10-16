'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _upstreams = require('../parsers/upstreams');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var targets = function targets(state, log) {
    var _log$params = log.params,
        type = _log$params.type,
        _log$params$endpoint = _log$params.endpoint,
        params = _log$params$endpoint.params,
        body = _log$params$endpoint.body,
        content = log.content;


    switch (type) {
        case 'add-upstream-target':
            return [].concat(_toConsumableArray(state.filter(function (target) {
                return target.target !== params.targetName;
            })), [(0, _upstreams.parseTarget)(content)]);
        case 'update-upstream-target':
            return state.map(function (state) {
                if (state._info.id !== content.id) {
                    return state;
                }

                return (0, _upstreams.parseTarget)(content);
            });
        case 'remove-upstream-target':
            return state.filter(function (target) {
                return target.target !== params.targetName;
            });
        default:
            return state;
    }
};

var upstream = function upstream(state, log) {
    var _log$params2 = log.params,
        type = _log$params2.type,
        _log$params2$endpoint = _log$params2.endpoint,
        params = _log$params2$endpoint.params,
        body = _log$params2$endpoint.body,
        content = log.content;


    switch (type) {
        case 'create-upstream':
            return _extends({}, (0, _upstreams.parseUpstream)(content), {
                targets: []
            });
        case 'update-upstream':
            if (state._info.id !== content.id) {
                return state;
            }

            return _extends({}, state, (0, _upstreams.parseUpstream)(content));

        case 'add-upstream-target':
        case 'update-upstream-target':
        case 'remove-upstream-target':
            if (state._info.id !== params.upstreamId) {
                return state;
            }

            return _extends({}, state, {
                targets: targets(state.targets, log)
            });

        default:
            return state;
    }
};

exports.default = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var log = arguments[1];

    if (log.type !== 'response') {
        return state;
    }

    var _log$params3 = log.params,
        type = _log$params3.type,
        params = _log$params3.endpoint.params,
        content = log.content;


    switch (type) {
        case 'create-upstream':
            return [].concat(_toConsumableArray(state), [upstream(undefined, log)]);
        case 'remove-upstream':
            return state.filter(function (upstream) {
                return upstream.name !== params.name;
            });

        case 'add-upstream-target':
        case 'update-upstream-target':
        case 'remove-upstream-target':
        case 'update-upstream':
            return state.map(function (state) {
                return upstream(state, log);
            });

        default:
            return state;
    }
};