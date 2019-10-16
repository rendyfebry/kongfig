'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _apis = require('./apis');

var _apis2 = _interopRequireDefault(_apis);

var _plugins = require('./plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _consumers = require('./consumers');

var _consumers2 = _interopRequireDefault(_consumers);

var _upstreams = require('./upstreams');

var _upstreams2 = _interopRequireDefault(_upstreams);

var _certificates = require('./certificates');

var _certificates2 = _interopRequireDefault(_certificates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var combine = function combine(reducers) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var log = arguments[1];

        return Object.keys(reducers).reduce(function (nextState, key) {
            nextState[key] = reducers[key](state[key], log);

            return nextState;
        }, state);
    };
};

var _info = function _info() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var log = arguments[1];
    var type = log.type;


    switch (type) {
        case 'kong-info':
            return _extends({}, state, { version: log.version });
        default:
            return state;
    }
};

exports.default = combine({
    _info: _info,
    apis: _apis2.default,
    plugins: _plugins2.default,
    consumers: _consumers2.default,
    upstreams: _upstreams2.default,
    certificates: _certificates2.default
});