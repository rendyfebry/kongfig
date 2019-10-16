'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getSupportedCredentials = getSupportedCredentials;
exports.getSchema = getSchema;
exports.addSchema = addSchema;
exports.addSchemasFromOptions = addSchemasFromOptions;
exports.addSchemasFromConfig = addSchemasFromConfig;
var schema = {
    'oauth2': {
        id: 'client_id'
    },
    'key-auth': {
        id: 'key'
    },
    'jwt': {
        id: 'key'
    },
    'basic-auth': {
        id: 'username'
    },
    'hmac-auth': {
        id: 'username'
    }
};

function getSupportedCredentials() {
    return Object.keys(schema);
}

function getSchema(name) {
    if (false === schema.hasOwnProperty(name)) {
        throw new Error('Unknown credential "' + name + '"');
    }

    return schema[name];
}

function addSchema(name, val) {
    if (schema.hasOwnProperty(name)) {
        throw new Error('There is already a schema with name \'' + name + '\'');
    }
    if (!val || !val.hasOwnProperty('id')) {
        throw new Error('Credential schema ' + name + ' should have a property named "id"');
    }
    schema[name] = val;
}

function addSchemasFromOptions(opts) {
    if (!opts || opts.length === 0) return;

    opts.forEach(function (val) {
        var vals = val.split(':');
        if (vals.length != 2) {
            throw new Error('Use <pluginname>:<keyname> format in ' + val);
        }
        addSchema(vals[0], { id: vals[1] });
    });
}

function addSchemasFromConfig(config) {
    if (!config.credentialSchemas) return;

    for (var key in config.credentialSchemas) {
        addSchema(key, config.credentialSchemas[key]);
    }
}