'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var createLogHandler = function createLogHandler(handlers) {
    return function (message) {
        if (handlers.hasOwnProperty(message.type)) {
            return handlers[message.type](message);
        }

        return handlers['unknown'](message);
    };
};

var censoredKeys = ['key', 'password', 'client_secret', 'access_token', 'refresh_token', 'provision_key', 'secret', 'cert'];

var censor = function censor(key, value) {
    if (typeof value !== 'string') {
        return value;
    }

    return censoredKeys.indexOf(key) === -1 ? value : '*****' + value.slice(-4);
};
var censorLogData = function censorLogData(data) {
    return JSON.parse(JSON.stringify(data, censor));
};

var screenLogger = exports.screenLogger = createLogHandler({
    noop: function noop(message) {
        return createLogHandler({
            'noop-api': function noopApi(_ref) {
                var api = _ref.api;
                return console.log('api ' + api.name.bold + ' ' + 'is up to date'.bold.green);
            },
            'noop-plugin': function noopPlugin(_ref2) {
                var plugin = _ref2.plugin;
                return console.log('- plugin ' + plugin.name.bold + ' ' + 'is up to date'.bold.green);
            },
            'noop-global-plugin': function noopGlobalPlugin(_ref3) {
                var plugin = _ref3.plugin;
                return console.log('global plugin ' + plugin.name.bold + ' ' + 'is up to date'.bold.green);
            },
            'noop-consumer': function noopConsumer(_ref4) {
                var consumer = _ref4.consumer;
                return console.log('consumer ' + consumer.username.bold + ' ' + 'is up to date'.bold.green);
            },
            'noop-credential': function noopCredential(_ref5) {
                var credential = _ref5.credential,
                    credentialIdName = _ref5.credentialIdName;
                return console.log('- credential ' + credential.name.bold + ' with ' + credentialIdName.bold + ': ' + censor('key', credential.attributes[credentialIdName]).bold + ' ' + 'is up to date'.bold.green);
            },
            'noop-upstream': function noopUpstream(_ref6) {
                var upstream = _ref6.upstream;
                return console.log('upstream ' + upstream.name.bold + ' ' + 'is up to date'.bold.green);
            },
            'noop-target': function noopTarget(_ref7) {
                var target = _ref7.target;
                return console.log('target ' + target.target.bold + ' ' + 'is up to date'.bold.green);
            },
            'noop-certificate': function noopCertificate(_ref8) {
                var identityClue = _ref8.identityClue;
                return console.log('certificate ' + identityClue + '... ' + 'is up to date'.bold.green);
            },
            'noop-certificate-sni': function noopCertificateSni(_ref9) {
                var sni = _ref9.sni;
                return console.log('certificate sni ' + sni.name + ' ' + 'is up to date'.bold.green);
            },
            'noop-certificate-sni-removed': function noopCertificateSniRemoved(_ref10) {
                var sni = _ref10.sni;
                return console.log('certificate sni ' + sni.name + ' ' + 'is NOT present'.bold.green);
            },

            unknown: function unknown(action) {
                return console.log('unknown action', action);
            }
        })(message.params);
    },
    request: function request(_ref11) {
        var uri = _ref11.uri,
            _ref11$params = _ref11.params,
            method = _ref11$params.method,
            body = _ref11$params.body;
        return console.log('\n' + method.bold.blue, uri.blue, "\n", body ? censorLogData(body) : '');
    },
    response: function response(_ref12) {
        var ok = _ref12.ok,
            status = _ref12.status,
            statusText = _ref12.statusText,
            content = _ref12.content;
        return console.log(ok ? (status + ' ' + statusText.bold).green : (status + ' ' + statusText.bold).red, censorLogData(content));
    },
    debug: function debug() {},
    'experimental-features': function experimentalFeatures(_ref13) {
        var message = _ref13.message;
        return console.log(message);
    },
    'kong-info': function kongInfo(_ref14) {
        var version = _ref14.version;
        return console.log('Kong version: ' + version);
    },
    unknown: function unknown(message) {
        return console.log('unknown', message);
    }
});