'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _consumerCredentials = require('./consumerCredentials');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchUpstreamsWithTargets = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref) {
        var version = _ref.version,
            fetchUpstreams = _ref.fetchUpstreams,
            fetchTargets = _ref.fetchTargets;
        var upstreams;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (!_semver2.default.lte(version, '0.10.0')) {
                            _context2.next = 2;
                            break;
                        }

                        return _context2.abrupt('return', Promise.resolve([]));

                    case 2:
                        _context2.next = 4;
                        return fetchUpstreams();

                    case 4:
                        upstreams = _context2.sent;
                        _context2.next = 7;
                        return Promise.all(upstreams.map(function () {
                            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(item) {
                                var targets;
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.next = 2;
                                                return fetchTargets(item.id);

                                            case 2:
                                                targets = _context.sent;
                                                return _context.abrupt('return', _extends({}, item, { targets: targets }));

                                            case 4:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, undefined);
                            }));

                            return function (_x2) {
                                return _ref3.apply(this, arguments);
                            };
                        }()));

                    case 7:
                        return _context2.abrupt('return', _context2.sent);

                    case 8:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function fetchUpstreamsWithTargets(_x) {
        return _ref2.apply(this, arguments);
    };
}();

var fetchCertificatesForVersion = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref4) {
        var version = _ref4.version,
            fetchCertificates = _ref4.fetchCertificates;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        if (!_semver2.default.lte(version, '0.10.0')) {
                            _context3.next = 2;
                            break;
                        }

                        return _context3.abrupt('return', Promise.resolve([]));

                    case 2:
                        _context3.next = 4;
                        return fetchCertificates();

                    case 4:
                        return _context3.abrupt('return', _context3.sent);

                    case 5:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function fetchCertificatesForVersion(_x3) {
        return _ref5.apply(this, arguments);
    };
}();

exports.default = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(_ref6) {
        var fetchApis = _ref6.fetchApis,
            fetchPlugins = _ref6.fetchPlugins,
            fetchGlobalPlugins = _ref6.fetchGlobalPlugins,
            fetchConsumers = _ref6.fetchConsumers,
            fetchConsumerCredentials = _ref6.fetchConsumerCredentials,
            fetchConsumerAcls = _ref6.fetchConsumerAcls,
            fetchUpstreams = _ref6.fetchUpstreams,
            fetchTargets = _ref6.fetchTargets,
            fetchTargetsV11Active = _ref6.fetchTargetsV11Active,
            fetchCertificates = _ref6.fetchCertificates,
            fetchKongVersion = _ref6.fetchKongVersion;
        var version, apis, apisWithPlugins, consumers, consumersWithCredentialsAndAcls, allPlugins, globalPlugins, upstreamsWithTargets, certificates;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return fetchKongVersion();

                    case 2:
                        version = _context6.sent;
                        _context6.next = 5;
                        return fetchApis();

                    case 5:
                        apis = _context6.sent;
                        _context6.next = 8;
                        return Promise.all(apis.map(function () {
                            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(item) {
                                var plugins;
                                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                _context4.next = 2;
                                                return fetchPlugins(item.id);

                                            case 2:
                                                plugins = _context4.sent;
                                                return _context4.abrupt('return', _extends({}, item, { plugins: plugins }));

                                            case 4:
                                            case 'end':
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, undefined);
                            }));

                            return function (_x5) {
                                return _ref8.apply(this, arguments);
                            };
                        }()));

                    case 8:
                        apisWithPlugins = _context6.sent;
                        _context6.next = 11;
                        return fetchConsumers();

                    case 11:
                        consumers = _context6.sent;
                        _context6.next = 14;
                        return Promise.all(consumers.map(function () {
                            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(consumer) {
                                var allCredentials, aclsFetched, consumerWithCredentials;
                                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                    while (1) {
                                        switch (_context5.prev = _context5.next) {
                                            case 0:
                                                if (!(consumer.custom_id && !consumer.username)) {
                                                    _context5.next = 3;
                                                    break;
                                                }

                                                console.log('Consumers with only custom_id not supported: ' + consumer.custom_id);

                                                return _context5.abrupt('return', consumer);

                                            case 3:
                                                allCredentials = Promise.all((0, _consumerCredentials.getSupportedCredentials)().map(function (name) {
                                                    return fetchConsumerCredentials(consumer.id, name).then(function (credentials) {
                                                        return [name, credentials];
                                                    });
                                                }));
                                                _context5.next = 6;
                                                return fetchConsumerAcls(consumer.id);

                                            case 6:
                                                aclsFetched = _context5.sent;
                                                consumerWithCredentials = allCredentials.then(function (result) {
                                                    return _extends({}, consumer, {
                                                        credentials: result.reduce(function (acc, _ref10) {
                                                            var _ref11 = _slicedToArray(_ref10, 2),
                                                                name = _ref11[0],
                                                                credentials = _ref11[1];

                                                            return _extends({}, acc, _defineProperty({}, name, credentials));
                                                        }, {}),
                                                        acls: aclsFetched

                                                    });
                                                });
                                                return _context5.abrupt('return', consumerWithCredentials);

                                            case 9:
                                            case 'end':
                                                return _context5.stop();
                                        }
                                    }
                                }, _callee5, undefined);
                            }));

                            return function (_x6) {
                                return _ref9.apply(this, arguments);
                            };
                        }()));

                    case 14:
                        consumersWithCredentialsAndAcls = _context6.sent;
                        _context6.next = 17;
                        return fetchGlobalPlugins();

                    case 17:
                        allPlugins = _context6.sent;
                        globalPlugins = allPlugins.filter(function (plugin) {
                            return plugin.api_id === undefined;
                        });
                        _context6.next = 21;
                        return fetchUpstreamsWithTargets({ version: version, fetchUpstreams: fetchUpstreams, fetchTargets: _semver2.default.gte(version, '0.12.0') ? fetchTargets : fetchTargetsV11Active });

                    case 21:
                        upstreamsWithTargets = _context6.sent;
                        _context6.next = 24;
                        return fetchCertificatesForVersion({ version: version, fetchCertificates: fetchCertificates });

                    case 24:
                        certificates = _context6.sent;
                        return _context6.abrupt('return', {
                            apis: apisWithPlugins,
                            consumers: consumersWithCredentialsAndAcls,
                            plugins: globalPlugins,
                            upstreams: upstreamsWithTargets,
                            certificates: certificates,
                            version: version
                        });

                    case 26:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function (_x4) {
        return _ref7.apply(this, arguments);
    };
}();