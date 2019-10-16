'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = {
    info: function info(message) {
        return console.log(message.green);
    },
    error: function error(message) {
        return console.error(message.red);
    }
};

exports.default = function (configPath) {
    if (!_fs2.default.existsSync(configPath)) {
        log.error(('Supplied --path \'' + configPath + '\' doesn\'t exist').red);
        return process.exit(1);
    }

    if (/(\.yml)|(\.yaml)/.test(configPath)) {
        return _jsYaml2.default.safeLoad(_fs2.default.readFileSync(configPath));
    }

    if (/(\.json)/.test(configPath)) {
        return JSON.parse(_fs2.default.readFileSync(configPath));
    }

    if (/(\.js)/.test(configPath)) {
        try {
            var config = require(resolvePath(configPath));

            if (config === null || (typeof config === 'undefined' ? 'undefined' : _typeof(config)) !== 'object' || Object.keys(config).length == 0) {
                log.error('Config file must export an object!\n' + CONFIG_SYNTAX_HELP);

                return process.exit(1);
            }

            return config;
        } catch (e) {
            if (e.code === 'MODULE_NOT_FOUND' && e.message.indexOf(configPath) !== -1) {
                log.error('File %s does not exist!', configPath);
            } else {
                log.error('Invalid config file!\n  ' + e.stack);
            }

            return process.exit(1);
        }
    }
};

function resolvePath(configPath) {
    if (_path2.default.isAbsolute(configPath)) {
        return configPath;
    }

    return _path2.default.resolve(process.cwd(), configPath);
}

var CONFIG_SYNTAX_HELP = '  module.exports = {\n' + '    // your config\n' + '  };\n';