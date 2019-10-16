'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _readKongApi = require('./readKongApi');

var _readKongApi2 = _interopRequireDefault(_readKongApi);

var _prettyConfig = require('./prettyConfig');

var _adminApi = require('./adminApi');

var _adminApi2 = _interopRequireDefault(_adminApi);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _requester = require('./requester');

var _requester2 = _interopRequireDefault(_requester);

var _utils = require('./utils');

var _consumerCredentials = require('./consumerCredentials');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version(require("../package.json").version).option('-f, --format <value>', 'Export format [screen, json, yaml] (default: yaml)', /^(screen|json|yaml|yml)$/, 'yaml').option('--host <value>', 'Kong admin host (default: localhost:8001)', 'localhost:8001').option('--https', 'Use https for admin API requests').option('--ignore-consumers', 'Ignore consumers in kong').option('--header [value]', 'Custom headers to be added to all requests', function (nextHeader, headers) {
    headers.push(nextHeader);return headers;
}, []).option('--credential-schema <value>', 'Add custom auth plugin in <name>:<key> format. Ex: custom_jwt:key. Repeat option for multiple custom plugins', _utils.repeatableOptionCallback, []).parse(process.argv);

if (!_commander2.default.host) {
    console.error('--host to the kong admin is required e.g. localhost:8001'.red);
    process.exit(1);
}

try {
    (0, _consumerCredentials.addSchemasFromOptions)(_commander2.default.credentialSchema);
} catch (e) {
    console.error(e.message.red);
    process.exit(1);
}

var headers = _commander2.default.header || [];

headers.map(function (h) {
    return h.split(':');
}).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        value = _ref2[1];

    return _requester2.default.addHeader(name, value);
});

(0, _readKongApi2.default)((0, _adminApi2.default)({ host: _commander2.default.host, https: _commander2.default.https, ignoreConsumers: _commander2.default.ignoreConsumers })).then(function (results) {
    return _extends({ host: _commander2.default.host, https: _commander2.default.https, headers: headers }, results);
}).then((0, _prettyConfig.pretty)(_commander2.default.format)).then(function (config) {
    process.stdout.write(config + '\n');
}).catch(function (error) {
    console.error(('' + error).red, '\n', error.stack);
    process.exit(1);
});