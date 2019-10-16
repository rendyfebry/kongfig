'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.noop = noop;
exports.createApi = createApi;
exports.removeApi = removeApi;
exports.updateApi = updateApi;
exports.addApiPlugin = addApiPlugin;
exports.removeApiPlugin = removeApiPlugin;
exports.updateApiPlugin = updateApiPlugin;
exports.addGlobalPlugin = addGlobalPlugin;
exports.removeGlobalPlugin = removeGlobalPlugin;
exports.updateGlobalPlugin = updateGlobalPlugin;
exports.createConsumer = createConsumer;
exports.updateConsumer = updateConsumer;
exports.removeConsumer = removeConsumer;
exports.addConsumerCredentials = addConsumerCredentials;
exports.updateConsumerCredentials = updateConsumerCredentials;
exports.removeConsumerCredentials = removeConsumerCredentials;
exports.addConsumerAcls = addConsumerAcls;
exports.removeConsumerAcls = removeConsumerAcls;

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function noop() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var type = _ref.type,
        rest = _objectWithoutProperties(_ref, ['type']);

    (0, _invariant2.default)(type, 'No-op must have a type');

    return _extends({
        type: type,
        noop: true
    }, rest);
}

function createApi(name, params) {
    return {
        type: 'create-api',
        endpoint: { name: 'apis' },
        method: 'POST',
        body: (0, _objectAssign2.default)({}, params, { name: name })
    };
};

function removeApi(name) {
    return {
        type: 'remove-api',
        endpoint: { name: 'api', params: { name: name } },
        method: 'DELETE'
    };
}

function updateApi(name, params) {
    return {
        type: 'update-api',
        endpoint: { name: 'api', params: { name: name } },
        method: 'PATCH',
        body: params
    };
}

function addApiPlugin(apiId, pluginName, params) {
    return {
        type: 'add-api-plugin',
        endpoint: { name: 'api-plugins', params: { apiId: apiId, pluginName: pluginName } },
        method: 'POST',
        body: (0, _objectAssign2.default)({}, params, { name: pluginName })
    };
}

function removeApiPlugin(apiId, pluginId) {
    return {
        type: 'remove-api-plugin',
        endpoint: { name: 'api-plugin', params: { apiId: apiId, pluginId: pluginId } },
        method: 'DELETE'
    };
}

function updateApiPlugin(apiId, pluginId, params) {
    return {
        type: 'update-api-plugin',
        endpoint: { name: 'api-plugin', params: { apiId: apiId, pluginId: pluginId } },
        method: 'PATCH',
        body: params
    };
}

function addGlobalPlugin(pluginName, params) {
    return {
        type: 'add-global-plugin',
        endpoint: { name: 'plugins', params: { pluginName: pluginName } },
        method: 'POST',
        body: (0, _objectAssign2.default)({}, params, { name: pluginName })
    };
}

function removeGlobalPlugin(pluginId) {
    return {
        type: 'remove-global-plugin',
        endpoint: { name: 'plugin', params: { pluginId: pluginId } },
        method: 'DELETE'
    };
}

function updateGlobalPlugin(pluginId, params) {
    return {
        type: 'update-global-plugin',
        endpoint: { name: 'plugin', params: { pluginId: pluginId } },
        method: 'PATCH',
        body: params
    };
}

function createConsumer(username, custom_id) {
    return {
        type: 'create-customer',
        endpoint: { name: 'consumers' },
        method: 'POST',
        body: { username: username, custom_id: custom_id }
    };
}

function updateConsumer(consumerId, params) {
    return {
        type: 'update-customer',
        endpoint: { name: 'consumer', params: { consumerId: consumerId } },
        method: 'PATCH',
        body: params
    };
}

function removeConsumer(consumerId) {
    return {
        type: 'remove-customer',
        endpoint: { name: 'consumer', params: { consumerId: consumerId } },
        method: 'DELETE'
    };
}

function addConsumerCredentials(consumerId, plugin, params) {
    return {
        type: 'add-customer-credential',
        endpoint: { name: 'consumer-credentials', params: { consumerId: consumerId, plugin: plugin } },
        method: 'POST',
        body: params
    };
}

function updateConsumerCredentials(consumerId, plugin, credentialId, params) {
    return {
        type: 'update-customer-credential',
        endpoint: { name: 'consumer-credential', params: { consumerId: consumerId, plugin: plugin, credentialId: credentialId } },
        method: 'PATCH',
        body: params
    };
}

function removeConsumerCredentials(consumerId, plugin, credentialId) {
    return {
        type: 'remove-customer-credential',
        endpoint: { name: 'consumer-credential', params: { consumerId: consumerId, plugin: plugin, credentialId: credentialId } },
        method: 'DELETE'
    };
}

function addConsumerAcls(consumerId, groupName) {
    return {
        type: 'add-customer-acls',
        endpoint: { name: 'consumer-acls', params: { consumerId: consumerId } },
        method: 'POST',
        body: {
            group: groupName
        }
    };
}

function removeConsumerAcls(consumerId, aclId) {
    return {
        type: 'remove-customer-acls',
        endpoint: { name: 'consumer-acl', params: { consumerId: consumerId, aclId: aclId } },
        method: 'DELETE'
    };
}