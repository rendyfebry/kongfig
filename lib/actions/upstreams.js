'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createUpstream = createUpstream;
exports.removeUpstream = removeUpstream;
exports.updateUpstream = updateUpstream;
exports.addUpstreamTarget = addUpstreamTarget;
exports.removeUpstreamTarget = removeUpstreamTarget;
exports.updateUpstreamTarget = updateUpstreamTarget;

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createUpstream(name, params) {
    return {
        type: 'create-upstream',
        endpoint: { name: 'upstreams' },
        method: 'POST',
        body: (0, _objectAssign2.default)({}, params, { name: name })
    };
}

function removeUpstream(name) {
    return {
        type: 'remove-upstream',
        endpoint: { name: 'upstream', params: { name: name } },
        method: 'DELETE'
    };
}

function updateUpstream(name, params) {
    return {
        type: 'update-upstream',
        endpoint: { name: 'upstream', params: { name: name } },
        method: 'PATCH',
        body: params
    };
}

function addUpstreamTarget(upstreamId, targetName, params) {
    return {
        type: 'add-upstream-target',
        endpoint: { name: 'upstream-targets', params: { upstreamId: upstreamId, targetName: targetName } },
        method: 'POST',
        body: (0, _objectAssign2.default)({}, params, { target: targetName })
    };
}

function removeUpstreamTarget(upstreamId, targetName) {
    return {
        type: 'remove-upstream-target',
        endpoint: { name: 'upstream-targets', params: { upstreamId: upstreamId, targetName: targetName } },
        method: 'POST',
        body: { target: targetName, weight: 0 }
    };
}

function updateUpstreamTarget(upstreamId, targetName, params) {
    return addUpstreamTarget(upstreamId, targetName, params);
}