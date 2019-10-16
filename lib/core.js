'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.consumerAclSchema = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getAclSchema = getAclSchema;
exports.apis = apis;
exports.globalPlugins = globalPlugins;
exports.plugins = plugins;
exports.consumers = consumers;
exports.credentials = credentials;
exports.acls = acls;
exports.upstreams = upstreams;
exports.targets = targets;
exports.certificates = certificates;
exports.certificatesSNIs = certificatesSNIs;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _readKongApi = require('./readKongApi');

var _readKongApi2 = _interopRequireDefault(_readKongApi);

var _consumerCredentials2 = require('./consumerCredentials');

var _utils = require('./utils');

var _migrate = require('./migrate');

var _kongStateLocal = require('./kongStateLocal');

var _stateSelector = require('./stateSelector');

var _stateSelector2 = _interopRequireDefault(_stateSelector);

var _diff = require('./diff');

var _diff2 = _interopRequireDefault(_diff);

var _actions = require('./actions');

var _upstreams = require('./actions/upstreams');

var _certificates = require('./actions/certificates');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var consumerAclSchema = exports.consumerAclSchema = {
    id: 'group'
};

function getAclSchema() {
    return consumerAclSchema;
}

var logFanout = function logFanout() {
    var listeners = [];

    return {
        logger: function logger(log) {
            return listeners.forEach(function (f) {
                return f(log);
            });
        },
        subscribe: function subscribe(f) {
            return listeners.push(f);
        }
    };
};

var selectWorldStateBind = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(adminApi, internalLogger) {
        var state;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (!(process.env.EXPERIMENTAL_USE_LOCAL_STATE == '1')) {
                            _context2.next = 7;
                            break;
                        }

                        internalLogger.logger({ type: 'experimental-features', message: 'Using experimental feature: local state'.blue.bold });
                        _context2.next = 4;
                        return (0, _readKongApi2.default)(adminApi);

                    case 4:
                        state = _context2.sent;


                        internalLogger.subscribe(function (log) {
                            state = (0, _kongStateLocal.logReducer)(state, log);
                        });

                        return _context2.abrupt('return', function (f) {
                            return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                return _context.abrupt('return', f(_createWorld((0, _stateSelector2.default)(state))));

                                            case 1:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, undefined);
                            }));
                        });

                    case 7:
                        return _context2.abrupt('return', _bindWorldState(adminApi));

                    case 8:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function selectWorldStateBind(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

// there is an issue with dependency by other definitions to consumers
// so they need to be added first and removed last
var splitConsumersByRemoved = function splitConsumersByRemoved(consumers) {
    return (consumers || []).reduce(function (results, consumer) {
        if (consumer.ensure === 'removed') {
            return _extends({}, results, { removed: [].concat(_toConsumableArray(results.removed), [consumer]) });
        }

        return _extends({}, results, { added: [].concat(_toConsumableArray(results.added), [consumer]) });
    }, { removed: [], added: [] });
};

exports.default = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(config, adminApi) {
        var logger = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
        var internalLogger, splitConsumersConfig, actions;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        internalLogger = logFanout();
                        splitConsumersConfig = splitConsumersByRemoved(config.consumers);
                        actions = [].concat(_toConsumableArray(consumers(splitConsumersConfig.added)), _toConsumableArray(upstreams(config.upstreams)), _toConsumableArray(apis(config.apis)), _toConsumableArray(globalPlugins(config.plugins)), _toConsumableArray(certificates(config.certificates)), _toConsumableArray(consumers(splitConsumersConfig.removed)));


                        internalLogger.subscribe(logger);

                        _context3.t0 = internalLogger;
                        _context3.next = 7;
                        return adminApi.fetchKongVersion();

                    case 7:
                        _context3.t1 = _context3.sent;
                        _context3.t2 = {
                            type: 'kong-info',
                            version: _context3.t1
                        };

                        _context3.t0.logger.call(_context3.t0, _context3.t2);

                        _context3.t3 = actions;
                        _context3.next = 13;
                        return selectWorldStateBind(adminApi, internalLogger);

                    case 13:
                        _context3.t4 = _context3.sent;

                        _context3.t5 = function (promise, action) {
                            return promise.then(_executeActionOnApi(action, adminApi, internalLogger.logger));
                        };

                        _context3.t6 = Promise.resolve('');
                        return _context3.abrupt('return', _context3.t3.map.call(_context3.t3, _context3.t4).reduce(_context3.t5, _context3.t6));

                    case 17:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    function execute(_x4, _x5) {
        return _ref3.apply(this, arguments);
    }

    return execute;
}();

function apis() {
    var apis = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return apis.reduce(function (actions, api) {
        return [].concat(_toConsumableArray(actions), [_api(api)], _toConsumableArray(_apiPlugins(api)));
    }, []);
}

function globalPlugins() {
    var globalPlugins = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return globalPlugins.reduce(function (actions, plugin) {
        return [].concat(_toConsumableArray(actions), [_globalPlugin(plugin)]);
    }, []);
}

function plugins(apiName, plugins) {
    return plugins.reduce(function (actions, plugin) {
        return [].concat(_toConsumableArray(actions), [_plugin(apiName, plugin)]);
    }, []);
}

function consumers() {
    var consumers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return consumers.reduce(function (calls, consumer) {
        return [].concat(_toConsumableArray(calls), [_consumer(consumer)], _toConsumableArray(_consumerCredentials(consumer)), _toConsumableArray(_consumerAcls(consumer)));
    }, []);
}

function credentials(username, credentials) {
    return credentials.reduce(function (actions, credential) {
        return [].concat(_toConsumableArray(actions), [_consumerCredential(username, credential)]);
    }, []);
}

function acls(username, acls) {
    return acls.reduce(function (actions, acl) {
        return [].concat(_toConsumableArray(actions), [_consumerAcl(username, acl)]);
    }, []);
}

function upstreams() {
    var upstreams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return upstreams.reduce(function (actions, upstream) {
        return [].concat(_toConsumableArray(actions), [_upstream(upstream)], _toConsumableArray(_upstreamTargets(upstream)));
    }, []);
}

function targets(upstreamName, targets) {
    return targets.reduce(function (actions, target) {
        return [].concat(_toConsumableArray(actions), [_target(upstreamName, target)]);
    }, []);
}

function certificates() {
    var certificates = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    return certificates.reduce(function (actions, cert) {
        return [].concat(_toConsumableArray(actions), [_certificate(cert)], _toConsumableArray(certificatesSNIs(cert, cert.snis)));
    }, []);
}

function certificatesSNIs(certificate, snis) {
    if (certificate.ensure === 'removed') {
        return [];
    }

    return snis.reduce(function (actions, sni) {
        return [].concat(_toConsumableArray(actions), [_sni(certificate, sni)]);
    }, []);
}

function parseResponseContent(content) {
    try {
        return JSON.parse(content);
    } catch (e) {}

    return content;
}

function _executeActionOnApi(action, adminApi, logger) {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var params;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return action();

                    case 2:
                        params = _context4.sent;

                        if (!params.noop) {
                            _context4.next = 6;
                            break;
                        }

                        logger({ type: 'noop', params: params });

                        return _context4.abrupt('return', Promise.resolve('No-op'));

                    case 6:

                        logger({ type: 'request', params: params, uri: adminApi.router(params.endpoint) });

                        return _context4.abrupt('return', adminApi.requestEndpoint(params.endpoint, params).then(function (response) {
                            return Promise.all([{
                                type: 'response',
                                ok: response.ok,
                                uri: adminApi.router(params.endpoint),
                                status: response.status,
                                statusText: response.statusText,
                                params: params
                            }, response.text()]);
                        }).then(function (_ref5) {
                            var _ref6 = _slicedToArray(_ref5, 2),
                                response = _ref6[0],
                                content = _ref6[1];

                            logger(_extends({}, response, { content: parseResponseContent(content) }));

                            if (!response.ok) {
                                var error = new Error(response.statusText + '\n' + content);
                                error.response = response;

                                throw error;
                            }
                        }));

                    case 8:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, _this);
    }));
}

function _bindWorldState(adminApi) {
    var _this2 = this;

    return function (f) {
        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var state;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return (0, _readKongApi2.default)(adminApi);

                        case 2:
                            state = _context5.sent;
                            return _context5.abrupt('return', f(_createWorld(state)));

                        case 4:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this2);
        }));
    };
}

function _createWorld(_ref8) {
    var apis = _ref8.apis,
        consumers = _ref8.consumers,
        plugins = _ref8.plugins,
        upstreams = _ref8.upstreams,
        certificates = _ref8.certificates,
        version = _ref8._info.version;

    var world = {
        getVersion: function getVersion() {
            return version;
        },

        hasApi: function hasApi(apiName) {
            return Array.isArray(apis) && apis.some(function (api) {
                return api.name === apiName;
            });
        },
        getApi: function getApi(apiName) {
            var api = apis.find(function (api) {
                return api.name === apiName;
            });

            (0, _invariant2.default)(api, 'Unable to find api ' + apiName);

            return api;
        },
        getApiId: function getApiId(apiName) {
            var id = world.getApi(apiName)._info.id;

            (0, _invariant2.default)(id, 'API ' + apiName + ' doesn\'t have an Id');

            return id;
        },
        getGlobalPlugin: function getGlobalPlugin(pluginName, pluginConsumerID) {
            var plugin = plugins.find(function (plugin) {
                return plugin.api_id === undefined && plugin.name === pluginName && plugin._info.consumer_id == pluginConsumerID;
            });

            (0, _invariant2.default)(plugin, 'Unable to find global plugin ' + pluginName + ' for consumer ' + pluginConsumerID);

            return plugin;
        },
        getPlugin: function getPlugin(apiName, pluginName, pluginConsumerID) {
            var plugin = world.getApi(apiName).plugins.find(function (plugin) {
                return plugin.name == pluginName && plugin._info.consumer_id == pluginConsumerID;
            });

            (0, _invariant2.default)(plugin, 'Unable to find plugin ' + pluginName);

            return plugin;
        },
        getPluginId: function getPluginId(apiName, pluginName, pluginConsumerID) {
            var pluginId = world.getPlugin(apiName, pluginName, pluginConsumerID)._info.id;

            (0, _invariant2.default)(pluginId, 'Unable to find plugin id for ' + apiName + ' and ' + pluginName);

            return pluginId;
        },
        getGlobalPluginId: function getGlobalPluginId(pluginName, pluginConsumerID) {
            var globalPluginId = world.getGlobalPlugin(pluginName, pluginConsumerID)._info.id;

            (0, _invariant2.default)(globalPluginId, 'Unable to find global plugin id ' + pluginName);

            return globalPluginId;
        },
        hasPlugin: function hasPlugin(apiName, pluginName, pluginConsumerID) {
            return Array.isArray(apis) && apis.some(function (api) {
                return api.name === apiName && Array.isArray(api.plugins) && api.plugins.some(function (plugin) {
                    return plugin.name == pluginName && plugin._info.consumer_id == pluginConsumerID;
                });
            });
        },
        hasGlobalPlugin: function hasGlobalPlugin(pluginName, pluginConsumerID) {
            return Array.isArray(plugins) && plugins.some(function (plugin) {
                return plugin.api_id === undefined && plugin.name === pluginName && plugin._info.consumer_id === pluginConsumerID;
            });
        },
        hasConsumer: function hasConsumer(username) {
            return Array.isArray(consumers) && consumers.some(function (consumer) {
                return consumer.username === username;
            });
        },
        hasConsumerCredential: function hasConsumerCredential(username, name, attributes) {
            var consumer = world.getConsumer(username);

            return !!extractCredential(consumer.credentials, name, attributes);
        },
        hasConsumerAcl: function hasConsumerAcl(username, groupName) {
            var schema = getAclSchema();

            return Array.isArray(consumers) && consumers.some(function (consumer) {
                return Array.isArray(consumer.acls) && consumer.acls.some(function (acl) {
                    return consumer.username === username && acl[schema.id] == groupName;
                });
            });
        },

        getConsumer: function getConsumer(username) {
            (0, _invariant2.default)(username, 'Username is required');

            var consumer = consumers.find(function (c) {
                return c.username === username;
            });

            (0, _invariant2.default)(consumer, 'Unable to find consumer ' + username);

            return consumer;
        },

        getConsumerId: function getConsumerId(username) {
            (0, _invariant2.default)(username, 'Username is required');

            var consumerId = world.getConsumer(username)._info.id;

            (0, _invariant2.default)(consumerId, 'Unable to find consumer id ' + username + ' ' + consumerId);

            return consumerId;
        },

        getConsumerCredential: function getConsumerCredential(username, name, attributes) {
            var consumer = world.getConsumer(username);

            var credential = extractCredential(consumer.credentials, name, attributes);

            (0, _invariant2.default)(credential, 'Unable to find consumer credential ' + username + ' ' + name);

            return credential;
        },

        getConsumerAcl: function getConsumerAcl(username, groupName) {
            var consumer = world.getConsumer(username);

            var acl = extractAclId(consumer.acls, groupName);

            (0, _invariant2.default)(acl, 'Unable to find consumer acl ' + username + ' ' + groupName);

            return acl;
        },

        getConsumerCredentialId: function getConsumerCredentialId(username, name, attributes) {
            var credentialId = world.getConsumerCredential(username, name, attributes)._info.id;

            (0, _invariant2.default)(credentialId, 'Unable to find consumer credential id ' + username + ' ' + name);

            return credentialId;
        },

        getConsumerAclId: function getConsumerAclId(username, groupName) {
            var aclId = world.getConsumerAcl(username, groupName)._info.id;

            (0, _invariant2.default)(aclId, 'Unable to find consumer acl id ' + username + ' ' + groupName);

            return aclId;
        },

        isConsumerUpToDate: function isConsumerUpToDate(username, custom_id) {
            var consumer = world.getConsumer(username);

            return consumer.custom_id == custom_id;
        },

        isApiUpToDate: function isApiUpToDate(api) {
            return (0, _diff2.default)(api.attributes, world.getApi(api.name).attributes).length == 0;
        },

        isApiPluginUpToDate: function isApiPluginUpToDate(apiName, plugin, consumerID) {
            if (false == plugin.hasOwnProperty('attributes')) {
                // of a plugin has no attributes, and its been added then it is up to date
                return true;
            }

            var current = world.getPlugin(apiName, plugin.name, consumerID);
            var attributes = (0, _utils.normalize)(plugin.attributes);

            return isAttributesWithConfigUpToDate(attributes, current.attributes);
        },

        isGlobalPluginUpToDate: function isGlobalPluginUpToDate(plugin, consumerID) {
            if (false == plugin.hasOwnProperty('attributes')) {
                // of a plugin has no attributes, and its been added then it is up to date
                return true;
            }

            var current = world.getGlobalPlugin(plugin.name, consumerID);
            var attributes = (0, _utils.normalize)(plugin.attributes);

            return isAttributesWithConfigUpToDate(attributes, current.attributes);
        },

        isConsumerCredentialUpToDate: function isConsumerCredentialUpToDate(username, credential) {
            var current = world.getConsumerCredential(username, credential.name, credential.attributes);

            return isAttributesWithConfigUpToDate(credential.attributes, current.attributes);
        },

        hasUpstream: function hasUpstream(upstreamName) {
            return Array.isArray(upstreams) && upstreams.some(function (upstream) {
                return upstream.name === upstreamName;
            });
        },
        getUpstream: function getUpstream(upstreamName) {
            var upstream = upstreams.find(function (upstream) {
                return upstream.name === upstreamName;
            });

            (0, _invariant2.default)(upstream, 'Unable to find upstream ' + upstreamName);

            return upstream;
        },
        getUpstreamId: function getUpstreamId(upstreamName) {
            var id = world.getUpstream(upstreamName)._info.id;

            (0, _invariant2.default)(id, 'Upstream ' + upstreamName + ' doesn\'t have an Id');

            return id;
        },
        isUpstreamUpToDate: function isUpstreamUpToDate(upstream) {
            return (0, _diff2.default)(upstream.attributes, world.getUpstream(upstream.name).attributes).length === 0;
        },
        hasUpstreamTarget: function hasUpstreamTarget(upstreamName, targetName) {
            return !!world.getActiveUpstreamTarget(upstreamName, targetName);
        },
        getUpstreamTarget: function getUpstreamTarget(upstreamName, targetName) {
            var target = world.getActiveUpstreamTarget(upstreamName, targetName);

            (0, _invariant2.default)(target, 'Unable to find target ' + targetName);

            return target;
        },
        isUpstreamTargetUpToDate: function isUpstreamTargetUpToDate(upstreamName, target) {
            if (!target.attributes) {
                return true;
            }

            var existing = upstreams.find(function (upstream) {
                return upstream.name === upstreamName;
            }).targets.find(function (t) {
                return t.target === target.target;
            });

            return !!existing && (0, _diff2.default)(target.attributes, existing.attributes).length === 0;
        },
        getActiveUpstreamTarget: function getActiveUpstreamTarget(upstreamName, targetName) {
            var upstream = upstreams.find(function (upstream) {
                return upstream.name === upstreamName && Array.isArray(upstream.targets) && upstream.targets.some(function (target) {
                    return target.target === targetName;
                });
            });

            if (upstream) {
                var _targets = upstream.targets.filter(function (target) {
                    return target.target === targetName;
                });

                // sort descending - newest to oldest
                _targets.sort(function (a, b) {
                    return a.created_at < b.created_at;
                });

                return _targets[0];
            }
        },
        getCertificate: function getCertificate(_ref9) {
            var key = _ref9.key;

            var certificate = certificates.find(function (x) {
                return x.key === key;
            });

            (0, _invariant2.default)(certificate, 'Unable to find certificate for ' + key.substr(1, 50));

            return certificate;
        },

        getCertificateId: function getCertificateId(certificate) {
            return world.getCertificate(certificate)._info.id;
        },

        hasCertificate: function hasCertificate(_ref10) {
            var key = _ref10.key;

            return certificates.some(function (x) {
                return x.key === key;
            });
        },

        isCertificateUpToDate: function isCertificateUpToDate(certificate) {
            var _world$getCertificate = world.getCertificate(certificate),
                key = _world$getCertificate.key,
                cert = _world$getCertificate.cert;

            return certificate.key == key && certificate.cert == cert;
        },

        getCertificateSNIs: function getCertificateSNIs(certificate) {
            var _world$getCertificate2 = world.getCertificate(certificate),
                snis = _world$getCertificate2.snis;

            return snis;
        }
    };

    return world;
}

function isAttributesWithConfigUpToDate(defined, current) {
    var excludingConfig = function excludingConfig(_ref11) {
        var config = _ref11.config,
            rest = _objectWithoutProperties(_ref11, ['config']);

        return rest;
    };

    return (0, _diff2.default)(defined.config, current.config).length === 0 && (0, _diff2.default)(excludingConfig(defined), excludingConfig(current)).length === 0;
}

function extractCredential(credentials, name, attributes) {
    var idName = (0, _consumerCredentials2.getSchema)(name).id;

    var credential = credentials.filter(function (c) {
        return c.name === name;
    }).filter(function (c) {
        return c.attributes[idName] === attributes[idName];
    });

    (0, _invariant2.default)(credential.length <= 1, 'consumer shouldn\'t have multiple ' + name + ' credentials with ' + idName + ' = ' + attributes[idName]);

    return credential.length ? credential[0] : undefined;
}

function extractAclId(acls, groupName) {
    var idName = getAclSchema().id;
    return acls.find(function (x) {
        return x[idName] == groupName;
    });
}

function _api(api) {
    validateEnsure(api.ensure);
    validateApiRequiredAttributes(api);

    return (0, _migrate.migrateApiDefinition)(api, function (api, world) {
        if (api.ensure == 'removed') {
            return world.hasApi(api.name) ? (0, _actions.removeApi)(api.name) : (0, _actions.noop)({ type: 'noop-api', api: api });
        }

        if (world.hasApi(api.name)) {
            if (world.isApiUpToDate(api)) {
                return (0, _actions.noop)({ type: 'noop-api', api: api });
            }

            return (0, _actions.updateApi)(api.name, api.attributes);
        }

        return (0, _actions.createApi)(api.name, api.attributes);
    });
}

function _apiPlugins(api) {
    return api.plugins && api.ensure != 'removed' ? plugins(api.name, api.plugins) : [];
}

function validateEnsure(ensure) {
    if (!ensure) {
        return;
    }

    if (['removed', 'present'].indexOf(ensure) === -1) {
        throw new Error('Invalid ensure "' + ensure + '"');
    }
}

function validateApiRequiredAttributes(api) {
    if (false == api.hasOwnProperty('name')) {
        throw Error('"Api name is required: ' + JSON.stringify(api, null, '  '));
    }

    if (false == api.hasOwnProperty('attributes')) {
        throw Error('"' + api.name + '" api has to declare "upstream_url" attribute');
    }

    if (false == api.attributes.hasOwnProperty('upstream_url')) {
        throw Error('"' + api.name + '" api has to declare "upstream_url" attribute');
    }
}

var swapConsumerReference = function swapConsumerReference(world, plugin) {
    if (!plugin.hasOwnProperty('attributes')) {
        return plugin;
    }

    var newPluginDef = plugin;

    if (plugin.attributes.hasOwnProperty('config') && plugin.attributes.config.anonymous_username) {
        var _plugin$attributes = plugin.attributes,
            _plugin$attributes$co = _plugin$attributes.config,
            anonymous_username = _plugin$attributes$co.anonymous_username,
            config = _objectWithoutProperties(_plugin$attributes$co, ['anonymous_username']),
            attributes = _objectWithoutProperties(_plugin$attributes, ['config']);

        var anonymous = world.getConsumerId(anonymous_username);

        newPluginDef = _extends({}, plugin, { attributes: _extends({ config: _extends({ anonymous: anonymous }, config) }, attributes) });
    }

    if (plugin.attributes.hasOwnProperty('username') && plugin.attributes.username) {
        var _plugin$attributes2 = plugin.attributes,
            username = _plugin$attributes2.username,
            _attributes = _objectWithoutProperties(_plugin$attributes2, ['username']); // remove username


        var consumer_id = world.getConsumerId(username);

        newPluginDef = _extends({}, plugin, { attributes: _extends({ consumer_id: consumer_id }, _attributes) });
    }

    return newPluginDef;
};

function _plugin(apiName, plugin) {
    validateEnsure(plugin.ensure);

    return function (world) {
        var finalPlugin = swapConsumerReference(world, plugin);
        var consumerID = finalPlugin.attributes && finalPlugin.attributes.consumer_id;

        if (plugin.ensure == 'removed') {
            if (world.hasPlugin(apiName, plugin.name, consumerID)) {
                return (0, _actions.removeApiPlugin)(world.getApiId(apiName), world.getPluginId(apiName, plugin.name, consumerID));
            }

            return (0, _actions.noop)({ type: 'noop-plugin', plugin: plugin });
        }

        if (world.hasPlugin(apiName, plugin.name, consumerID)) {
            if (world.isApiPluginUpToDate(apiName, plugin, consumerID)) {
                return (0, _actions.noop)({ type: 'noop-plugin', plugin: plugin });
            }

            return (0, _actions.updateApiPlugin)(world.getApiId(apiName), world.getPluginId(apiName, plugin.name, consumerID), finalPlugin.attributes);
        }

        return (0, _actions.addApiPlugin)(world.getApiId(apiName), plugin.name, finalPlugin.attributes);
    };
}

function _globalPlugin(plugin) {
    validateEnsure(plugin.ensure);

    return function (world) {
        var finalPlugin = swapConsumerReference(world, plugin);
        var consumerID = finalPlugin.attributes && finalPlugin.attributes.consumer_id;

        if (plugin.ensure == 'removed') {
            if (world.hasGlobalPlugin(plugin.name, consumerID)) {
                return (0, _actions.removeGlobalPlugin)(world.getGlobalPluginId(plugin.name, consumerID));
            }

            return (0, _actions.noop)({ type: 'noop-global-plugin', plugin: plugin });
        }

        if (world.hasGlobalPlugin(plugin.name, consumerID)) {
            if (world.isGlobalPluginUpToDate(plugin, consumerID)) {
                return (0, _actions.noop)({ type: 'noop-global-plugin', plugin: plugin });
            }

            return (0, _actions.updateGlobalPlugin)(world.getGlobalPluginId(plugin.name, consumerID), finalPlugin.attributes);
        }

        return (0, _actions.addGlobalPlugin)(plugin.name, finalPlugin.attributes);
    };
}

function _consumer(consumer) {
    validateEnsure(consumer.ensure);
    validateConsumer(consumer);

    return function (world) {
        if (consumer.ensure == 'removed') {
            if (world.hasConsumer(consumer.username)) {
                return (0, _actions.removeConsumer)(world.getConsumerId(consumer.username));
            }

            return (0, _actions.noop)({ type: 'noop-consumer', consumer: consumer });
        }

        if (!world.hasConsumer(consumer.username)) {
            return (0, _actions.createConsumer)(consumer.username, consumer.custom_id);
        }

        if (!world.isConsumerUpToDate(consumer.username, consumer.custom_id)) {
            return (0, _actions.updateConsumer)(world.getConsumerId(consumer.username), { username: consumer.username, custom_id: consumer.custom_id });
        }

        return (0, _actions.noop)({ type: 'noop-consumer', consumer: consumer });
    };

    var _credentials = [];

    if (consumer.credentials && consumer.ensure != 'removed') {
        _credentials = consumerCredentials(consumer.username, consumer.credentials);
    }

    var _acls = [];

    if (consumer.acls && consumer.ensure != 'removed') {
        _acls = consumerAcls(consumer.username, consumer.acls);
    }

    return [consumerAction].concat(_toConsumableArray(_credentials), _toConsumableArray(_acls));
}

function validateConsumer(_ref12) {
    var username = _ref12.username;

    if (!username) {
        throw new Error("Consumer username must be specified");
    }
}

function _consumerCredentials(consumer) {
    if (!consumer.credentials || consumer.ensure == 'removed') {
        return [];
    }

    return credentials(consumer.username, consumer.credentials);
}

function _consumerCredential(username, credential) {
    validateEnsure(credential.ensure);
    validateCredentialRequiredAttributes(credential);

    return function (world) {
        if (credential.ensure == 'removed') {
            if (world.hasConsumerCredential(username, credential.name, credential.attributes)) {
                var credentialId = world.getConsumerCredentialId(username, credential.name, credential.attributes);

                return (0, _actions.removeConsumerCredentials)(world.getConsumerId(username), credential.name, credentialId);
            }

            return (0, _actions.noop)({ type: 'noop-credential', credential: credential, credentialIdName: credentialIdName });
        }

        if (world.hasConsumerCredential(username, credential.name, credential.attributes)) {
            var _credentialId = world.getConsumerCredentialId(username, credential.name, credential.attributes);

            if (world.isConsumerCredentialUpToDate(username, credential)) {
                var _credentialIdName = (0, _consumerCredentials2.getSchema)(credential.name).id;

                return (0, _actions.noop)({ type: 'noop-credential', credential: credential, credentialIdName: _credentialIdName });
            }

            return (0, _actions.updateConsumerCredentials)(world.getConsumerId(username), credential.name, _credentialId, credential.attributes);
        }

        return (0, _actions.addConsumerCredentials)(world.getConsumerId(username), credential.name, credential.attributes);
    };
}

function validateCredentialRequiredAttributes(credential) {
    var credentialIdName = (0, _consumerCredentials2.getSchema)(credential.name).id;

    if (false == credential.hasOwnProperty('attributes')) {
        throw Error(credential.name + ' has to declare attributes.' + credentialIdName);
    }

    if (false == credential.attributes.hasOwnProperty(credentialIdName)) {
        throw Error(credential.name + ' has to declare attributes.' + credentialIdName);
    }
}

function validateAclRequiredAttributes(acl) {
    var aclIdName = getAclSchema().id;

    if (false == acl.hasOwnProperty(aclIdName)) {
        throw Error('ACLs has to declare property ' + aclIdName);
    }
}

function _consumerAcls(consumer) {
    if (!consumer.acls || consumer.ensure == 'removed') {
        return [];
    }

    return acls(consumer.username, consumer.acls);
}

function _consumerAcl(username, acl) {

    validateEnsure(acl.ensure);
    validateAclRequiredAttributes(acl);

    return function (world) {
        if (acl.ensure == 'removed') {
            if (world.hasConsumerAcl(username, acl.group)) {
                var aclId = world.getConsumerAclId(username, acl.group);

                return (0, _actions.removeConsumerAcls)(world.getConsumerId(username), aclId);
            }

            return (0, _actions.noop)({ type: 'noop-acl', acl: acl });
        }

        if (world.hasConsumerAcl(username, acl.group)) {
            return (0, _actions.noop)({ type: 'noop-acl', acl: acl });
        }

        return (0, _actions.addConsumerAcls)(world.getConsumerId(username), acl.group);
    };
}

function _upstream(upstream) {
    validateEnsure(upstream.ensure);
    validateUpstreamRequiredAttributes(upstream);

    return function (world) {
        if (upstream.ensure == 'removed') {
            if (world.hasUpstream(upstream.name)) {
                return (0, _upstreams.removeUpstream)(upstream.name);
            }

            return (0, _actions.noop)({ type: 'noop-upstream', upstream: upstream });
        }

        if (world.hasUpstream(upstream.name)) {
            if (world.isUpstreamUpToDate(upstream)) {
                return (0, _actions.noop)({ type: 'noop-upstream', upstream: upstream });
            }

            return (0, _upstreams.updateUpstream)(upstream.name, upstream.attributes);
        }

        return (0, _upstreams.createUpstream)(upstream.name, upstream.attributes);
    };
}

function _target(upstreamName, target) {
    validateEnsure(target.ensure);

    return function (world) {
        if (target.ensure == 'removed' || target.attributes && target.attributes.weight === 0) {
            if (world.hasUpstreamTarget(upstreamName, target.target)) {
                return (0, _upstreams.removeUpstreamTarget)(world.getUpstreamId(upstreamName), target.target);
            }

            return (0, _actions.noop)({ type: 'noop-target', target: target });
        }

        if (world.hasUpstreamTarget(upstreamName, target.target)) {
            if (world.isUpstreamTargetUpToDate(upstreamName, target)) {
                return (0, _actions.noop)({ type: 'noop-target', target: target });
            }

            return (0, _upstreams.updateUpstreamTarget)(world.getUpstreamId(upstreamName), target.target, target.attributes);
        }

        return (0, _upstreams.addUpstreamTarget)(world.getUpstreamId(upstreamName), target.target, target.attributes);
    };
}

function _upstreamTargets(upstream) {
    return upstream.targets && upstream.ensure != 'removed' ? targets(upstream.name, upstream.targets) : [];
}

function validateUpstreamRequiredAttributes(upstream) {
    if (false == upstream.hasOwnProperty('name')) {
        throw Error('Upstream name is required: ' + JSON.stringify(upstream, null, '  '));
    }
}

var _certificate = function _certificate(certificate) {
    validateEnsure(certificate.ensure);

    return function (world) {
        var identityClue = certificate.key.substr(1, 50);

        if (certificate.ensure == 'removed') {
            if (world.hasCertificate(certificate)) {
                return (0, _certificates.removeCertificate)(world.getCertificateId(certificate));
            }

            return (0, _actions.noop)({ type: 'noop-certificate', identityClue: identityClue });
        }

        if (world.hasCertificate(certificate)) {
            if (world.isCertificateUpToDate(certificate)) {
                return (0, _actions.noop)({ type: 'noop-certificate', identityClue: identityClue });
            }

            return updateCertificate(world.getCertificateId(certificate), certificate);
        }

        return (0, _certificates.addCertificate)(certificate);
    };
};

var _sni = function _sni(certificate, sni) {
    validateEnsure(sni.ensure);
    (0, _invariant2.default)(sni.name, 'sni must have a name');

    return function (world) {
        var currentSNIs = world.getCertificateSNIs(certificate).map(function (x) {
            return x.name;
        });
        var hasSNI = currentSNIs.indexOf(sni.name) !== -1;

        if (sni.ensure == 'removed') {
            if (hasSNI) {
                return (0, _certificates.removeCertificateSNI)(sni.name);
            }

            return (0, _actions.noop)({ type: 'noop-certificate-sni-removed', sni: sni });
        }

        if (hasSNI) {
            return (0, _actions.noop)({ type: 'noop-certificate-sni', sni: sni });
        }

        return (0, _certificates.addCertificateSNI)(world.getCertificateId(certificate), sni.name);
    };
};