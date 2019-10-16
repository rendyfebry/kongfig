'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _readKongApi = require('../readKongApi');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var acls = function acls(state, log) {
    var _log$params = log.params,
        type = _log$params.type,
        params = _log$params.endpoint.params,
        content = log.content;


    switch (type) {
        case 'add-customer-acls':
            return [].concat(_toConsumableArray(state), [(0, _readKongApi.parseAcl)(content)]);
        case 'remove-customer-acls':
            return state.filter(function (acl) {
                return acl._info.id !== params.aclId;
            });
        default:
            return state;
    }
};

// the implementation in the readKongApi is not compatible
// because the payload doesn't contain the plugin name
var parseCredential = function parseCredential(name, _ref) {
    var consumer_id = _ref.consumer_id,
        id = _ref.id,
        created_at = _ref.created_at,
        attributes = _objectWithoutProperties(_ref, ['consumer_id', 'id', 'created_at']);

    return {
        name: name,
        attributes: attributes,
        _info: { id: id, consumer_id: consumer_id, created_at: created_at }
    };
};

var credentials = function credentials(state, log) {
    var _log$params2 = log.params,
        type = _log$params2.type,
        params = _log$params2.endpoint.params,
        content = log.content;


    switch (type) {
        case 'add-customer-credential':
            return [].concat(_toConsumableArray(state), [parseCredential(params.plugin, content)]);
        case 'remove-customer-credential':
            return state.filter(function (credential) {
                return credential._info.id !== params.credentialId;
            });
        case 'update-customer-credential':
            return state.map(function (state) {
                if (state._info.id !== params.credentialId) {
                    return state;
                }

                return parseCredential(params.plugin, content);
            });
        default:
            return state;
    }
};

var customer = function customer(state, log) {
    var _log$params3 = log.params,
        type = _log$params3.type,
        params = _log$params3.endpoint.params,
        content = log.content;


    switch (type) {
        case 'create-customer':
            return _extends({}, (0, _readKongApi.parseConsumer)(content), {
                acls: [],
                credentials: []
            });
        case 'update-customer':
            return _extends({}, state, (0, _readKongApi.parseConsumer)(content));

        case 'remove-customer-acls':
        case 'add-customer-acls':
            if (state._info.id !== params.consumerId) {
                return state;
            }

            return _extends({}, state, {
                acls: acls(state.acls, log)
            });

        case 'update-customer-credential':
        case 'remove-customer-credential':
        case 'add-customer-credential':
            if (state._info.id !== params.consumerId) {
                return state;
            }

            return _extends({}, state, {
                credentials: credentials(state.credentials, log)
            });
        default:
            return state;
    }
};

exports.default = function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var log = arguments[1];

    if (log.type !== 'response') {
        return state;
    }

    var _log$params4 = log.params,
        type = _log$params4.type,
        params = _log$params4.endpoint.params,
        content = log.content;


    switch (type) {
        case 'create-customer':
            return [].concat(_toConsumableArray(state), [customer(undefined, log)]);
        case 'remove-customer':
            return state.filter(function (consumer) {
                return consumer._info.id !== params.consumerId;
            });

        case 'add-customer-credential':
        case 'update-customer-credential':
        case 'remove-customer-credential':
        case 'add-customer-acls':
        case 'remove-customer-acls':
        case 'update-customer':
            return state.map(function (state) {
                if (state._info.id !== params.consumerId) {
                    return state;
                }

                return customer(state, log);
            });
        default:
            return state;
    }
};