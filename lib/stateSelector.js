'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var getConsumerById = function getConsumerById(id, consumers) {
    var consumer = consumers.find(function (x) {
        return x._info.id === id;
    });

    (0, _invariant2.default)(consumer, 'Unable to find a consumer for ' + id);

    return consumer;
};

exports.default = function (state) {
    var fixPluginAnonymous = function fixPluginAnonymous(_ref) {
        var name = _ref.name,
            _ref$attributes = _ref.attributes,
            config = _ref$attributes.config,
            attributes = _objectWithoutProperties(_ref$attributes, ['config']),
            plugin = _objectWithoutProperties(_ref, ['name', 'attributes']);

        if (config && config.anonymous) {
            var anonymous = config.anonymous,
                restOfConfig = _objectWithoutProperties(config, ['anonymous']);

            var _getConsumerById = getConsumerById(anonymous, state.consumers),
                username = _getConsumerById.username;

            return _extends({ name: name, attributes: _extends({}, attributes, { config: _extends({ anonymous_username: username }, restOfConfig) }) }, plugin);
        }

        return _extends({ name: name, attributes: _extends({}, attributes, { config: config }) }, plugin);
    };

    var fixPluginUsername = function fixPluginUsername(_ref2) {
        var name = _ref2.name,
            _ref2$attributes = _ref2.attributes,
            consumer_id = _ref2$attributes.consumer_id,
            attributes = _objectWithoutProperties(_ref2$attributes, ['consumer_id']),
            plugin = _objectWithoutProperties(_ref2, ['name', 'attributes']);

        if (!consumer_id) {
            return _extends({ name: name, attributes: attributes }, plugin);
        }

        var _getConsumerById2 = getConsumerById(consumer_id, state.consumers),
            username = _getConsumerById2.username;

        return _extends({ name: name, attributes: _extends({ username: username }, attributes) }, plugin);
    };

    var fixApiPluginUsername = function fixApiPluginUsername(api) {
        return _extends({}, api, {
            plugins: (api.plugins || []).map(fixPluginUsername).map(fixPluginAnonymous)
        });
    };

    return _extends({}, state, {
        apis: state.apis && state.apis.map(fixApiPluginUsername),
        plugins: state.plugins && state.plugins.map(fixPluginUsername).map(fixPluginAnonymous)
    });
};