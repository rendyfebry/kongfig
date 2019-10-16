'use strict';

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pkg = require("../package.json");

_commander2.default.version(pkg.version).allowUnknownOption().command('apply', 'Apply config to a kong server', { isDefault: true }).command('dump', 'Dump the configuration from a kong server').parse(process.argv);