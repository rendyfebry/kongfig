'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _requester = require('./requester');

var _requester2 = _interopRequireDefault(_requester);

var _utils = require('./utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pluginSchemasCache = void 0;
var kongVersionCache = void 0;
var resultsCache = {};

exports.default = function (_ref) {
    var host = _ref.host,
        https = _ref.https,
        ignoreConsumers = _ref.ignoreConsumers,
        cache = _ref.cache;

    var router = (0, _router2.default)(host, https);

    return createApi({
        router: router,
        ignoreConsumers: ignoreConsumers,
        getPaginatedJson: cache ? getPaginatedJsonCache : getPaginatedJson
    });
};

function createApi(_ref2) {
    var router = _ref2.router,
        getPaginatedJson = _ref2.getPaginatedJson,
        ignoreConsumers = _ref2.ignoreConsumers;

    return {
        router: router,
        fetchApis: function fetchApis() {
            return getPaginatedJson(router({ name: 'apis' }));
        },
        fetchGlobalPlugins: function fetchGlobalPlugins() {
            return getPaginatedJson(router({ name: 'plugins' }));
        },
        fetchPlugins: function fetchPlugins(apiId) {
            return getPaginatedJson(router({ name: 'api-plugins', params: { apiId: apiId } }));
        },
        fetchConsumers: function fetchConsumers() {
            return ignoreConsumers ? Promise.resolve([]) : getPaginatedJson(router({ name: 'consumers' }));
        },
        fetchConsumerCredentials: function fetchConsumerCredentials(consumerId, plugin) {
            return getPaginatedJson(router({ name: 'consumer-credentials', params: { consumerId: consumerId, plugin: plugin } }));
        },
        fetchConsumerAcls: function fetchConsumerAcls(consumerId) {
            return getPaginatedJson(router({ name: 'consumer-acls', params: { consumerId: consumerId } }));
        },
        fetchUpstreams: function fetchUpstreams() {
            return getPaginatedJson(router({ name: 'upstreams' }));
        },
        fetchTargets: function fetchTargets(upstreamId) {
            return getPaginatedJson(router({ name: 'upstream-targets', params: { upstreamId: upstreamId } }));
        },
        fetchTargetsV11Active: function fetchTargetsV11Active(upstreamId) {
            return getPaginatedJson(router({ name: 'upstream-targets-active', params: { upstreamId: upstreamId } }));
        },
        fetchCertificates: function fetchCertificates() {
            return getPaginatedJson(router({ name: 'certificates' }));
        },

        // this is very chatty call and doesn't change so its cached
        fetchPluginSchemas: function fetchPluginSchemas() {
            if (pluginSchemasCache) {
                return Promise.resolve(pluginSchemasCache);
            }

            return getPaginatedJson(router({ name: 'plugins-enabled' })).then(function (json) {
                return Promise.all(getEnabledPluginNames(json.enabled_plugins).map(function (plugin) {
                    return getPluginScheme(plugin, function (plugin) {
                        return router({ name: 'plugins-scheme', params: { plugin: plugin } });
                    });
                }));
            }).then(function (all) {
                return pluginSchemasCache = new Map(all);
            });
        },
        fetchKongVersion: function fetchKongVersion() {
            if (kongVersionCache) {
                return Promise.resolve(kongVersionCache);
            }

            return getPaginatedJson(router({ name: 'root' })).then(function (json) {
                return Promise.resolve(json.version);
            }).then(function (version) {
                return kongVersionCache = (0, _utils.parseVersion)(version);
            });
        },
        requestEndpoint: function requestEndpoint(endpoint, params) {
            resultsCache = {};
            return _requester2.default.request(router(endpoint), prepareOptions(params));
        }
    };
}

function getEnabledPluginNames(enabledPlugins) {
    if (!Array.isArray(enabledPlugins)) {
        return Object.keys(enabledPlugins);
    }

    return enabledPlugins;
}

function getPaginatedJsonCache(uri) {
    if (resultsCache.hasOwnProperty(uri)) {
        return resultsCache[uri];
    }

    var result = getPaginatedJson(uri);
    resultsCache[uri] = result;

    return result;
}

function getPluginScheme(plugin, schemaRoute) {
    return getPaginatedJson(schemaRoute(plugin)).then(function (_ref3) {
        var fields = _ref3.fields;
        return [plugin, fields];
    });
}

function getPaginatedJson(uri) {
    return _requester2.default.get(uri).then(function (response) {
        if (!response.ok) {
            var error = new Error(uri + ': ' + response.status + ' ' + response.statusText);
            error.response = response;

            throw error;
        }

        return response;
    }).then(function (r) {
        return r.json();
    }).then(function (json) {
        if (!json.hasOwnProperty('data')) return json;
        if (!json.hasOwnProperty('next')) {
            if (Object.keys(json.data).length === 0 && json.data.constructor === Object) {
                // when no results were found
                // sometimes the data attribute is set to an empty object `{}` rather than a list `[]`
                return [];
            }

            return json.data;
        }

        if (json.data.length < 100) {
            // FIXME an hopeful hack to prevent a loop
            return json.data;
        }

        if (process.argv.indexOf("--host") > -1) {
            if (json.next.indexOf('localhost') > -1) {
                var _uri = 'http' + (process.argv.indexOf("--https") > -1 ? 's' : '') + '://' + process.argv[process.argv.indexOf("--host") + 1];
                var newNextURL = '' + _uri + json.next.substr(json.next.indexOf(json.next.split('/')[3]) - 1);
                json.next = newNextURL;
            }
        }

        return getPaginatedJson(json.next).then(function (data) {
            return json.data.concat(data);
        });
    });
}

var prepareOptions = function prepareOptions(_ref4) {
    var method = _ref4.method,
        body = _ref4.body;

    if (body) {
        return {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
    }

    return {
        method: method,
        headers: {
            'Accept': 'application/json'
        }
    };
};