'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

var _adminApi = require('./adminApi');

var _adminApi2 = _interopRequireDefault(_adminApi);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _configLoader = require('./configLoader');

var _configLoader2 = _interopRequireDefault(_configLoader);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _requester = require('./requester');

var _requester2 = _interopRequireDefault(_requester);

var _utils = require('./utils');

var _logger = require('./logger');

var _consumerCredentials = require('./consumerCredentials');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

_commander2.default.version(require("../package.json").version).option('--path <value>', 'Path to the configuration file').option('--host <value>', 'Kong admin host (default: localhost:8001)').option('--https', 'Use https for admin API requests').option('--no-cache', 'Do not cache kong state in memory').option('--ignore-consumers', 'Do not sync consumers').option('--header [value]', 'Custom headers to be added to all requests', function (nextHeader, headers) {
    headers.push(nextHeader);return headers;
}, []).option('--credential-schema <value>', 'Add custom auth plugin in <name>:<key> format. Ex: custom_jwt:key. Repeat option for multiple custom plugins', _utils.repeatableOptionCallback, []).parse(process.argv);

if (!_commander2.default.path) {
    console.error('--path to the config file is required'.red);
    process.exit(1);
}

try {
    (0, _consumerCredentials.addSchemasFromOptions)(_commander2.default.credentialSchema);
} catch (e) {
    console.error(e.message.red);
    process.exit(1);
}

console.log('Loading config ' + _commander2.default.path);

var config = (0, _configLoader2.default)(_commander2.default.path);
var host = _commander2.default.host || config.host || 'localhost:8001';
var https = _commander2.default.https || config.https || false;
var ignoreConsumers = _commander2.default.ignoreConsumers || !config.consumers || config.consumers.length === 0 || false;
var cache = _commander2.default.cache;

config.headers = config.headers || [];

var headers = new Map();
[].concat(_toConsumableArray(config.headers), _toConsumableArray(_commander2.default.header)).map(function (h) {
    return h.split(':');
}).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        value = _ref2[1];

    return headers.set(name, value);
});

headers.forEach(function (value, name) {
    return _requester2.default.addHeader(name, value);
});

if (!host) {
    console.error('Kong admin host must be specified in config or --host'.red);
    process.exit(1);
}

if (ignoreConsumers) {
    config.consumers = [];
} else {
    try {
        (0, _consumerCredentials.addSchemasFromConfig)(config);
    } catch (e) {
        console.error(e.message.red);
        process.exit(1);
    }
}

console.log(('Apply config to ' + host).green);

(0, _core2.default)(config, (0, _adminApi2.default)({ host: host, https: https, ignoreConsumers: ignoreConsumers, cache: cache }), _logger.screenLogger).catch(function (error) {
    console.error(('' + error).red, '\n', error.stack);
    process.exit(1);
});