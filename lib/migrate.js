'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.migrateApiDefinition = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var DEFINITION_V1 = 'v1';
var DEFINITION_V2 = 'v2';

var _removeUndefined = function _removeUndefined(x) {
    return JSON.parse(JSON.stringify(x));
};

var _guessDefinitionVersion = function _guessDefinitionVersion(api) {
    if (['hosts', 'uris', 'methods'].filter(function (x) {
        return api.attributes.hasOwnProperty(x);
    }).length > 0) {
        return DEFINITION_V2;
    }

    return DEFINITION_V1;
};

var _migrateV1toV2 = function _migrateV1toV2(api) {
    var _api$attributes = api.attributes,
        request_host = _api$attributes.request_host,
        request_path = _api$attributes.request_path,
        strip_request_path = _api$attributes.strip_request_path,
        oldAttributes = _objectWithoutProperties(_api$attributes, ['request_host', 'request_path', 'strip_request_path']);

    var newAttributes = {
        hosts: api.attributes.request_host ? [api.attributes.request_host] : undefined,
        uris: api.attributes.request_path ? [api.attributes.request_path] : undefined,
        strip_uri: api.attributes.strip_request_path
    };

    return _removeUndefined(_extends({}, api, { attributes: _extends({}, oldAttributes, newAttributes) }));
};

var _migrateApiDefinitionToVersion = function _migrateApiDefinitionToVersion(api, kongVersion) {
    switch (_guessDefinitionVersion(api)) {
        case DEFINITION_V1:
            if (_semver2.default.gte(kongVersion, '0.10.0')) {
                return _migrateV1toV2(api);
            }

            return api;
        default:
            return api;
    }
};

var migrateApiDefinition = exports.migrateApiDefinition = function migrateApiDefinition(api, fn) {
    return function (world) {
        return fn(_migrateApiDefinitionToVersion(api, world.getVersion()), world);
    };
};