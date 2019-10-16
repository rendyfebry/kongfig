'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pretty = pretty;
exports.prettyScreen = prettyScreen;
exports.prettyJson = prettyJson;
exports.prettyYaml = prettyYaml;
exports.removeInfo = removeInfo;

var _prettyjson = require('prettyjson');

var _prettyjson2 = _interopRequireDefault(_prettyjson);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pretty(format) {
    switch (format) {
        case 'json':
            return function (config) {
                return prettyJson(removeInfo(config));
            };
        case 'yaml':
            return function (config) {
                return prettyYaml(removeInfo(config));
            };
        case 'yml':
            return function (config) {
                return prettyYaml(removeInfo(config));
            };
        case 'screen':
            return prettyScreen;
        default:
            throw new Error('Unknown --format ' + format);
    }
}

function prettyScreen(config) {
    return _prettyjson2.default.render(config, {});
}

function prettyJson(config) {
    return JSON.stringify(config, null, '  ');
}

function prettyYaml(config) {
    return _jsYaml2.default.safeDump(config);
}

function removeInfo(config) {
    return JSON.parse(JSON.stringify(config, function (key, value) {
        if (key == '_info') {
            return undefined;
        }

        return value;
    }));
}