'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseGlobalPlugin = exports.parsePlugin = exports.parseApiPostV10 = exports.parseAcl = exports.parseConsumer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _kongState = require('./kongState');

var _kongState2 = _interopRequireDefault(_kongState);

var _upstreams = require('./parsers/upstreams');

var _certificates = require('./parsers/certificates');

var _stateSelector = require('./stateSelector');

var _stateSelector2 = _interopRequireDefault(_stateSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(adminApi) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        return _context.abrupt('return', Promise.all([(0, _kongState2.default)(adminApi), adminApi.fetchPluginSchemas(), adminApi.fetchKongVersion()]).then(function (_ref2) {
                            var _ref3 = _slicedToArray(_ref2, 3),
                                state = _ref3[0],
                                schemas = _ref3[1],
                                version = _ref3[2];

                            return (0, _stateSelector2.default)({
                                _info: { version: version },
                                apis: parseApis(state.apis, version),
                                consumers: parseConsumers(state.consumers),
                                plugins: parseGlobalPlugins(state.plugins),
                                upstreams: _semver2.default.gte(version, '0.10.0') ? (0, _upstreams.parseUpstreams)(state.upstreams) : undefined,
                                certificates: _semver2.default.gte(version, '0.10.0') ? (0, _certificates.parseCertificates)(state.certificates) : undefined
                            });
                        }));

                    case 1:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}();

var parseConsumer = function parseConsumer(_ref4) {
    var username = _ref4.username,
        custom_id = _ref4.custom_id,
        credentials = _ref4.credentials,
        acls = _ref4.acls,
        _info = _objectWithoutProperties(_ref4, ['username', 'custom_id', 'credentials', 'acls']);

    return {
        username: username,
        custom_id: custom_id,
        _info: _info
    };
};

exports.parseConsumer = parseConsumer;
var parseAcl = function parseAcl(_ref5) {
    var group = _ref5.group,
        _info = _objectWithoutProperties(_ref5, ['group']);

    return { group: group, _info: _info };
};

exports.parseAcl = parseAcl;
function parseConsumers(consumers) {
    return consumers.map(function (_ref6) {
        var username = _ref6.username,
            custom_id = _ref6.custom_id,
            credentials = _ref6.credentials,
            acls = _ref6.acls,
            _info = _objectWithoutProperties(_ref6, ['username', 'custom_id', 'credentials', 'acls']);

        return _extends({}, parseConsumer(_extends({ username: username, custom_id: custom_id }, _info)), {
            acls: Array.isArray(acls) ? acls.map(parseAcl) : [],
            credentials: zip(Object.keys(credentials), Object.values(credentials)).map(parseCredential).reduce(function (acc, x) {
                return acc.concat(x);
            }, [])
        });
    });
}

function zip(a, b) {
    return a.map(function (n, index) {
        return [n, b[index]];
    });
}

function parseCredential(_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        credentialName = _ref8[0],
        credentials = _ref8[1];

    if (!Array.isArray(credentials)) {
        return [];
    }

    return credentials.map(function (_ref9) {
        var consumer_id = _ref9.consumer_id,
            id = _ref9.id,
            created_at = _ref9.created_at,
            attributes = _objectWithoutProperties(_ref9, ['consumer_id', 'id', 'created_at']);

        return {
            name: credentialName,
            attributes: attributes,
            _info: { id: id, consumer_id: consumer_id, created_at: created_at }
        };
    });
}

function parseApis(apis, kongVersion) {
    if (_semver2.default.gte(kongVersion, '0.10.0')) {
        return parseApisV10(apis);
    }

    return parseApisBeforeV10(apis);
}

var parseApiPreV10 = function parseApiPreV10(_ref10) {
    var name = _ref10.name,
        request_host = _ref10.request_host,
        request_path = _ref10.request_path,
        strip_request_path = _ref10.strip_request_path,
        preserve_host = _ref10.preserve_host,
        upstream_url = _ref10.upstream_url,
        id = _ref10.id,
        created_at = _ref10.created_at;

    return {
        name: name,
        plugins: [],
        attributes: {
            request_host: request_host,
            request_path: request_path,
            strip_request_path: strip_request_path,
            preserve_host: preserve_host,
            upstream_url: upstream_url
        },
        _info: {
            id: id,
            created_at: created_at
        }
    };
};

var parseApiPostV10 = exports.parseApiPostV10 = function parseApiPostV10(_ref11) {
    var name = _ref11.name,
        plugins = _ref11.plugins,
        hosts = _ref11.hosts,
        uris = _ref11.uris,
        methods = _ref11.methods,
        strip_uri = _ref11.strip_uri,
        preserve_host = _ref11.preserve_host,
        upstream_url = _ref11.upstream_url,
        id = _ref11.id,
        created_at = _ref11.created_at,
        https_only = _ref11.https_only,
        http_if_terminated = _ref11.http_if_terminated,
        retries = _ref11.retries,
        upstream_connect_timeout = _ref11.upstream_connect_timeout,
        upstream_read_timeout = _ref11.upstream_read_timeout,
        upstream_send_timeout = _ref11.upstream_send_timeout;

    return {
        name: name,
        attributes: {
            hosts: hosts,
            uris: uris,
            methods: methods,
            strip_uri: strip_uri,
            preserve_host: preserve_host,
            upstream_url: upstream_url,
            retries: retries,
            upstream_connect_timeout: upstream_connect_timeout,
            upstream_read_timeout: upstream_read_timeout,
            upstream_send_timeout: upstream_send_timeout,
            https_only: https_only,
            http_if_terminated: http_if_terminated
        },
        _info: {
            id: id,
            created_at: created_at
        }
    };
};

var withParseApiPlugins = function withParseApiPlugins(parseApi) {
    return function (api) {
        var _parseApi = parseApi(api),
            name = _parseApi.name,
            rest = _objectWithoutProperties(_parseApi, ['name']);

        return _extends({ name: name, plugins: parseApiPlugins(api.plugins) }, rest);
    };
};

function parseApisBeforeV10(apis) {
    return apis.map(withParseApiPlugins(parseApiPreV10));
}

function parseApisV10(apis) {
    return apis.map(withParseApiPlugins(parseApiPostV10));
}

var parsePlugin = exports.parsePlugin = function parsePlugin(_ref12) {
    var name = _ref12.name,
        config = _ref12.config,
        id = _ref12.id,
        api_id = _ref12.api_id,
        consumer_id = _ref12.consumer_id,
        enabled = _ref12.enabled,
        created_at = _ref12.created_at;

    return {
        name: name,
        attributes: {
            enabled: enabled,
            consumer_id: consumer_id,
            config: stripConfig(config)
        },
        _info: {
            id: id,
            //api_id,
            consumer_id: consumer_id,
            created_at: created_at
        }
    };
};

function parseApiPlugins(plugins) {
    if (!Array.isArray(plugins)) {
        return [];
    }

    return plugins.map(parsePlugin);
}

var parseGlobalPlugin = exports.parseGlobalPlugin = function parseGlobalPlugin(_ref13) {
    var name = _ref13.name,
        enabled = _ref13.enabled,
        config = _ref13.config,
        id = _ref13.id,
        api_id = _ref13.api_id,
        consumer_id = _ref13.consumer_id,
        created_at = _ref13.created_at;

    return {
        name: name,
        attributes: {
            enabled: enabled,
            consumer_id: consumer_id,
            config: stripConfig(config)
        },
        _info: {
            id: id,
            api_id: api_id,
            consumer_id: consumer_id,
            created_at: created_at
        }
    };
};

function parseGlobalPlugins(plugins) {
    if (!Array.isArray(plugins)) {
        return [];
    }

    return plugins.map(parseGlobalPlugin).filter(function (x) {
        return x.name;
    });
}

function stripConfig(config) {
    var mutableConfig = _extends({}, config);

    // remove some cache values
    delete mutableConfig['_key_der_cache'];
    delete mutableConfig['_cert_der_cache'];

    return mutableConfig;
}