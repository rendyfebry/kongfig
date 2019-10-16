'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logReducer = undefined;

var _readKongApi = require('./readKongApi');

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logReducer = exports.logReducer = function logReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var log = arguments[1];

    if (log.type !== 'response' && log.type !== 'kong-info') {
        return state;
    }

    return (0, _reducers2.default)(state, log);
};