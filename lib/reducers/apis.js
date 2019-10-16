'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _readKongApi = require('../readKongApi');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var plugins = function plugins(state, log) {
    var _log$params = log.params,
        type = _log$params.type,
        _log$params$endpoint = _log$params.endpoint,
        params = _log$params$endpoint.params,
        body = _log$params$endpoint.body,
        content = log.content;


    switch (type) {
        case 'add-api-plugin':
            return [].concat(_toConsumableArray(state), [(0, _readKongApi.parsePlugin)(content)]);
        case 'update-api-plugin':
            return state.map(function (state) {
                if (state._info.id !== content.id) {
                    return state;
                }

                return (0, _readKongApi.parsePlugin)(content);
            });
        case 'remove-api-plugin':
            return state.filter(function (plugin) {
                return plugin._info.id !== params.pluginId;
            });
        default:
            return state;
    }
};

var api = function api(state, log) {
    var _log$params2 = log.params,
        type = _log$params2.type,
        _log$params2$endpoint = _log$params2.endpoint,
        params = _log$params2$endpoint.params,
        body = _log$params2$endpoint.body,
        content = log.content;


    switch (type) {
        case 'create-api':
            return _extends({}, (0, _readKongApi.parseApiPostV10)(content), {
                plugins: []
            });
        case 'update-api':
            if (state._info.id !== content.id) {
                return state;
            }

            return _extends({}, state, (0, _readKongApi.parseApiPostV10)(content));

        case 'add-api-plugin':
        case 'update-api-plugin':
        case 'remove-api-plugin':
            if (state._info.id !== params.apiId) {
                return state;
            }

            return _extends({}, state, {
                plugins: plugins(state.plugins, log)
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
        case 'create-api':
            return [].concat(_toConsumableArray(state), [api(undefined, log)]);
        case 'remove-api':
            return state.filter(function (api) {
                return api.name !== params.name;
            });

        case 'add-api-plugin':
        case 'update-api-plugin':
        case 'remove-api-plugin':
        case 'update-api':
            return state.map(function (state) {
                return api(state, log);
            });

        default:
            return state;
    }
};