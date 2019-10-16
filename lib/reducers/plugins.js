'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _readKongApi = require('../readKongApi');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var log = arguments[1];

    if (log.type !== 'response') {
        return state;
    }

    var _log$params = log.params,
        type = _log$params.type,
        params = _log$params.endpoint.params,
        content = log.content;


    switch (type) {
        case 'add-global-plugin':
            return [].concat(_toConsumableArray(state), [(0, _readKongApi.parseGlobalPlugin)(content)]);
        case 'update-global-plugin':
            return state.map(function (plugin) {
                if (plugin._info.id !== params.pluginId) {
                    return plugin;
                }

                return (0, _readKongApi.parseGlobalPlugin)(content);
            });
        case 'remove-global-plugin':
            return state.filter(function (plugin) {
                return plugin._info.id !== params.pluginId;
            });
        default:
            return state;
    }

    return state;
};